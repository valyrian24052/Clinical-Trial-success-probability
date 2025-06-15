import requests, csv, io, time

def fetch_clinical_trials_data(nct_ids, output_filename, api_params, api_headers):
    with open(output_filename, 'w', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)
        header_written = False

        for nct_id in nct_ids:
            url = f"https://clinicaltrials.gov/api/v2/studies/{nct_id}"    
            print(f"Fetching data for {nct_id}...")

            try:
                response = requests.get(url, params=api_params, headers=api_headers, timeout=30)
                response.raise_for_status()
                text_data = response.text

                if not text_data.strip():
                    print(f"  Warning: Received an empty but successful response for {nct_id}. Skipping.")
                    continue

                string_file = io.StringIO(text_data)
                csv_reader = csv.reader(string_file)
                header = next(csv_reader)

                if not header_written:
                    csv_writer.writerow(header)
                    header_written = True

                for data_row in csv_reader:
                    csv_writer.writerow(data_row)

                print(f"  Success! Wrote data for {nct_id}.")

            except requests.exceptions.HTTPError as e:
                print(f"  Error for {nct_id}: {e}")
            except requests.exceptions.RequestException as e:
                print(f"  A network error occurred for {nct_id}: {e}")

            time.sleep(1)

    print(f"\nProcessing complete. Data saved to '{output_filename}'.")

def read_trial_ids_from_csv(input_csv_path):
    nct_ids = []
    with open(input_csv_path, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            if 'Trial_ID' in row:
                nct_ids.append(row['Trial_ID'].strip())
    return nct_ids

def main():
    INPUT_CSV_PATH = 'Train.csv'
    OUTPUT_FILENAME = 'train_clinical_trials_data.csv'

    API_HEADERS = {
        'accept': 'text/csv',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
    }

    API_PARAMS = {
        'format': 'csv',
        'fields': 'NCT Number|Study Title|Study URL|Acronym|Study Status|Brief Summary|Study Results|Conditions|Interventions|Primary Outcome Measures|Secondary Outcome Measures|Other Outcome Measures|Sponsor|Collaborators|Sex|Age|Phases|Enrollment|Funder Type|Study Type|Study Design|Start Date|Primary Completion Date|Completion Date|First Posted|Results First Posted|Last Update Posted|Locations|Study Documents',
    }

    NCT_IDS = read_trial_ids_from_csv(INPUT_CSV_PATH)
    fetch_clinical_trials_data(NCT_IDS, OUTPUT_FILENAME, API_PARAMS, API_HEADERS)

if __name__ == "__main__":
    main()