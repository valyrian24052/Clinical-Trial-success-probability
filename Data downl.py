import requests
import pandas as pd
import io
from tqdm import tqdm

def fetch_clinical_trials_data(nct_ids, output_excel_filename, api_params, api_headers):
    all_data = []
    errors = []

    for nct_id in tqdm(nct_ids, desc="Fetching Data", unit="trial"):
        url = f"https://clinicaltrials.gov/api/v2/studies/{nct_id}"
        try:
            response = requests.get(url, params=api_params, headers=api_headers, timeout=30)
            response.raise_for_status()
            text_data = response.text

            if not text_data.strip():
                errors.append(f"Warning: Empty response for {nct_id}")
                continue

            # Read CSV into DataFrame
            df = pd.read_csv(io.StringIO(text_data))
            df['NCT_ID'] = nct_id  # Optionally tag which ID this came from
            all_data.append(df)

        except requests.exceptions.HTTPError as e:
            errors.append(f"HTTP error for {nct_id}: {e}")
        except requests.exceptions.RequestException as e:
            errors.append(f"Request error for {nct_id}: {e}")
        except Exception as e:
            errors.append(f"Unexpected error for {nct_id}: {e}")

    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        # Save to Excel (recommended format: .xlsx for compatibility)
        combined_df.to_excel(output_excel_filename, index=False, engine='openpyxl')
        print(f"\nSaved {len(combined_df)} records to {output_excel_filename}")
    else:
        print("\nNo data was fetched.")

    if errors:
        print("\nErrors encountered:")
        for err in errors:
            print(err)

def read_trial_ids_from_csv(input_csv_path):
    df = pd.read_csv(input_csv_path)
    if 'Trial_ID' not in df.columns:
        raise ValueError("The input CSV must contain a 'Trial_ID' column.")
    return df['Trial_ID'].dropna().astype(str).tolist()

def main():
    INPUT_CSV_PATH = 'Ini data ids/Train.csv'
    OUTPUT_EXCEL_FILENAME = 'Train test Data/Train_clinical_trials_data.xlsx'

    API_HEADERS = {
        'accept': 'text/csv',
        'User-Agent': 'Mozilla/5.0'
    }

    API_PARAMS = {
        'format': 'csv',
        'fields': 'NCT Number|Study Title|Study URL|Acronym|Study Status|Brief Summary|Study Results|Conditions|Interventions|Primary Outcome Measures|Secondary Outcome Measures|Other Outcome Measures|Sponsor|Collaborators|Sex|Age|Phases|Enrollment|Funder Type|Study Type|Study Design|Start Date|Primary Completion Date|Completion Date|First Posted|Results First Posted|Last Update Posted|Locations|Study Documents',
    }

    nct_ids = read_trial_ids_from_csv(INPUT_CSV_PATH)
    fetch_clinical_trials_data(nct_ids, OUTPUT_EXCEL_FILENAME, API_PARAMS, API_HEADERS)

if __name__ == "__main__":
    main()
