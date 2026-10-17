"""
ScamShield AI - Python CLI Bridge
Accepts JSON on stdin, executes the pipeline, and prints JSON output to stdout.
"""
import sys
import os
import json

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python_engine.pipeline import run_pipeline

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"error": "Empty input"}))
            sys.exit(1)
            
        data = json.loads(raw_input)
        message = data.get("message", "")
        language = data.get("language", "en")
        simulated_ai_output = data.get("simulated_ai_output")
        force_source = data.get("force_source")
        
        result = run_pipeline(
            message=message,
            language=language,
            simulated_ai_output=simulated_ai_output,
            force_source=force_source
        )
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
