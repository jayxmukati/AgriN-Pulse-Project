import re
import os

def convert(filename, out_filename, comp_name):
    with open(filename, 'r') as f:
        html = f.read()
    
    # extract body
    body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.IGNORECASE)
    if not body_match:
        print(f"Could not find body in {filename}")
        return
    
    body = body_match.group(1)
    
    # replace class= with className=
    body = body.replace('class=', 'className=')
    # replace for= with htmlFor=
    body = body.replace('for=', 'htmlFor=')
    # replace style="..." with empty or something (Stitch uses some inline styles, need to convert to object, but let's just remove simple ones or let it break and fix manually)
    # wait, Stitch style="font-variation-settings: 'FILL' 1; font-weight: 600;"
    # Actually, let's just write a generic React component wrapper and let the user fix minor things, or I can use a quick regex to fix some common inline styles.
    body = re.sub(r'style="([^"]*)"', lambda m: 'style={{' + ', '.join([f"'{k.strip()}': '{v.strip()}'" for k, v in [p.split(':', 1) for p in m.group(1).split(';') if ':' in p]]) + '}}', body)
    
    # close img tags
    body = re.sub(r'(<img[^>]*?[^/])>', r'\1 />', body)
    # close input tags
    body = re.sub(r'(<input[^>]*?[^/])>', r'\1 />', body)
    # remove HTML comments
    body = re.sub(r'<!--.*?-->', '', body, flags=re.DOTALL)
    
    jsx = f"""import React from 'react';
import axios from 'axios';

export default function {comp_name}() {{
  return (
    <>
      {body}
    </>
  );
}}
"""
    os.makedirs(os.path.dirname(out_filename), exist_ok=True)
    with open(out_filename, 'w') as f:
        f.write(jsx)

convert('stitch_exports/stitch_agrin_pulse_farmer_app/code.html', 'frontend/src/components/FarmerApp.jsx', 'FarmerApp')
convert('stitch_exports/stitch_crop_pathology_diagnostic_results/code.html', 'frontend/src/components/DiagnosticResults.jsx', 'DiagnosticResults')
convert('stitch_exports/stitch_brics_agrin_pulse_dashboard/code.html', 'frontend/src/components/PolicyDashboard.jsx', 'PolicyDashboard')

