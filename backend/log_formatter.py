import json

class LogFormatter:

    def format_output(self, command, output):
        try:
            data = json.loads(output)
            formatted_data = {
                "Name": data.get("name", "N/A"),
                "ID": data.get("id", "N/A"),
                "Type": data.get("type", "N/A"),
                "Location": data.get("location", "N/A"),
                "Resource Group": data.get("resourceGroup", "N/A")
            }
            
            # Handle nested structures
            for key, value in data.items():
                if isinstance(value, dict):
                    formatted_data[key] = "{...nested data...}"
                elif isinstance(value, list) and len(value) > 5:  # arbitrary number, can be adjusted
                    formatted_data[key] = f"[...list of {len(value)} items...]"
            
            # Convert the formatted data back to a JSON string with indentation for readability
            return json.dumps(formatted_data, indent=2)
        except:
            return output

