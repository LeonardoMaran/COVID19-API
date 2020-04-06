import csv
import requests
from os import environ
from itertools import islice

GOOGLE_API_KEY = environ.get("GOOGLE_API_KEY")
GOOGLE_API_KEY or exit("GOOGLE_API_KEY must be set in environment")

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=%s&sensor=false&key=%s"

INPUT_FILE_COLUMNS = {'region': 6, 'data': {'confirmed': 11, 'deaths': 12}}
INPUT_FILES = [("confirmed", "imports/raw/confirmed.csv"), ("deaths", "imports/raw/deaths.csv")]
OUTPUT_FILE_DIR = "imports/processed"

print("Processing input files...")
aggregates = {file[0]: {} for file in INPUT_FILES}
locations = {}

for (series, filename) in INPUT_FILES:
    print("Processing %s" % filename)
    with open(filename) as file:
        for row in islice(csv.reader(file), 1, None):
            region = row[INPUT_FILE_COLUMNS['region']]
            data = row[INPUT_FILE_COLUMNS['data'][series]:]
            if region not in aggregates[series]:
                aggregates[series][region] = [0] * len(data)

            if region not in locations:
                print("Looking up location for %s" % region)
                response = requests.get(GOOGLE_GEOCODE_URL % (region, GOOGLE_API_KEY))
                results = response.json()['results']
                if results:
                    locations[region] = results[0]['geometry']['location']
                else:
                    print("Could not determine location for %s" % region)
                    locations[region] = {"lat": 0.0, "lng": 0.0}

            # Inconsistencies in timliness of reporting mean some municipalities don't report at the same interval
            # Need to extend array if one municipality has reported more recent data than any others.
            aggregates[series][region] += [0] * (len(data) - len(aggregates[series][region]))
            aggregates[series][region] = [aggregates[series][region][i] + int(data[i]) for i in range(len(data))]

    with open("%s/%s.csv" % (OUTPUT_FILE_DIR, series), "w") as file:
        for region in aggregates[series]:
            location = locations[region]
            file.write("%s,%s,%.3f,%.3f,%s\n" % (region, "United States", location['lat'], location['lng'], ",".join(str(s) for s in aggregates[series][region])))

print("Import complete!")
