import argparse
import json
import re


def detect_case(user_input: str) -> dict:
	text = (user_input or "").strip()
	lower = text.lower()

	cases = [
		{
			"id": "python_name_error",
			"patterns": [r"nameerror", r"is not defined", r"undefined variable"],
			"language": "Python",
			"error_name": "NameError",
			"root_cause": "used a variable before creating it",
			"fix_steps_en": [
				"Step 1: Find the variable name shown in the error.",
				"Step 2: Create that variable before using it.",
				"Step 3: Check spelling and upper/lowercase letters.",
			],
			"example_code": "name = 'Rahul'\nprint(name)",
		},
		{
			"id": "python_syntax_error",
			"patterns": [r"syntaxerror", r"invalid syntax"],
			"language": "Python",
			"error_name": "SyntaxError",
			"root_cause": "Python could not read the line because punctuation or structure is wrong",
			"fix_steps_en": [
				"Step 1: Go to the line number shown in the error.",
				"Step 2: Check missing colon, bracket, quote, or comma.",
				"Step 3: Run again after fixing the line.",
			],
			"example_code": "age = 18\nif age >= 18:\n    print('Adult')",
		},
		{
			"id": "python_indentation_error",
			"patterns": [r"indentationerror", r"unexpected indent", r"expected an indented block"],
			"language": "Python",
			"error_name": "IndentationError",
			"root_cause": "spaces are not aligned correctly in blocks like if, for, and function",
			"fix_steps_en": [
				"Step 1: Check the line shown in the error.",
				"Step 2: Keep consistent spaces (usually 4 spaces in Python).",
				"Step 3: Do not mix tabs and spaces.",
			],
			"example_code": "score = 90\nif score > 50:\n    print('Pass')",
		},
		{
			"id": "python_type_error",
			"patterns": [r"typeerror", r"unsupported operand type", r"can only concatenate"],
			"language": "Python",
			"error_name": "TypeError",
			"root_cause": "two values of different types were used together in a wrong way",
			"fix_steps_en": [
				"Step 1: Check value types (string, number, list, etc.).",
				"Step 2: Convert values to the same type if needed.",
				"Step 3: Run again after conversion.",
			],
			"example_code": "price = '10'\nquantity = 2\ntotal = int(price) * quantity\nprint(total)",
		},
		{
			"id": "js_reference_error",
			"patterns": [r"referenceerror", r"is not defined", r"undefined"],
			"language": "JavaScript",
			"error_name": "ReferenceError",
			"root_cause": "a variable was used before declaration or with wrong spelling",
			"fix_steps_en": [
				"Step 1: Find the variable name in the error message.",
				"Step 2: Declare it using let or const before use.",
				"Step 3: Match exact spelling in all places.",
			],
			"example_code": "const userName = 'Aman';\nconsole.log(userName);",
		},
		{
			"id": "java_null_pointer",
			"patterns": [r"nullpointerexception", r"cannot invoke", r"because .* is null"],
			"language": "Java",
			"error_name": "NullPointerException",
			"root_cause": "an object is empty (null) but code is trying to use it",
			"fix_steps_en": [
				"Step 1: Find which object is null from the error line.",
				"Step 2: Create/assign the object before using it.",
				"Step 3: Add a null check before calling methods.",
			],
			"example_code": "public class Main {\n    public static void main(String[] args) {\n        String name = \"Riya\";\n        System.out.println(name.length());\n    }\n}",
		},
	]

	for case in cases:
		for pattern in case["patterns"]:
			if re.search(pattern, lower):
				return case

	looks_like_code = any(token in text for token in ["\n", ";", "{", "}", "def ", "function ", "class ", "print(", "console.log"]) 
	if looks_like_code:
		return {
			"id": "code_only",
			"language": "Unknown",
			"error_name": "Code Explanation",
			"root_cause": "no clear error message was provided, so likely issue is missing variable setup or wrong order",
			"fix_steps_en": [
				"Step 1: Run the code and copy the exact error message.",
				"Step 2: Check variable names and order of execution.",
				"Step 3: Add small print/log lines to verify values step by step.",
			],
			"example_code": "num1 = 5\nnum2 = 7\nprint(num1 + num2)",
		}

	return {
		"id": "unclear_input",
		"language": "Unknown",
		"error_name": "Likely Variable Error",
		"root_cause": "input is unclear, but beginners often use a variable before creating it",
		"fix_steps_en": [
			"Step 1: Share exact error text if possible.",
			"Step 2: Make sure every variable is defined before use.",
			"Step 3: Check spelling of names in all lines.",
		],
		"example_code": "message = 'Hello'\nprint(message)",
	}


def normalize_language(language: str) -> str:
	lang = (language or "English").strip().lower()
	if lang in ["hindi", "hi"]:
		return "Hindi"
	if lang in ["hinglish"]:
		return "Hinglish"
	return "English"


def build_response(user_input: str, language: str) -> dict:
	case = detect_case(user_input)
	lang = normalize_language(language)
	error_name = case["error_name"]
	root_cause = case["root_cause"]
	example_code = case["example_code"]

	if lang == "Hindi":
		summary = f"यह {error_name} इसलिए आया क्योंकि कोड में एक बुनियादी गलती है।"
		meaning = f"इसका मतलब है कि प्रोग्राम उस लाइन को सही से चला नहीं पा रहा। यह {case['language']} कोड में आम शुरुआती गलती है।"
		why_it_happens = f"मुख्य कारण: {root_cause}. यानी कोड का क्रम या लिखने का तरीका गलत हो गया।"
		fix_steps = [
			"Step 1: एरर मैसेज में दी गई लाइन और नाम को ध्यान से देखें।",
			"Step 2: जो चीज़ मिसिंग है (जैसे variable/object/syntax), उसे पहले सही करें।",
			"Step 3: दोबारा रन करके देखें और नया एरर आए तो उसी तरह एक-एक करके ठीक करें।",
		]
		common_mistake = "शुरुआती लोग अक्सर नाम की spelling बदल देते हैं या चीज़ को use करने से पहले define नहीं करते।"
		analogy = "इसे ऐसे समझो: बिना चाबी के दरवाज़ा खोलने की कोशिश। पहले चाबी चाहिए, फिर दरवाज़ा खुलेगा।"
		pro_tip = "हर नई लाइन लिखने के बाद छोटा टेस्ट रन करो, बड़ी गलती बनने से पहले समस्या पकड़ में आ जाएगी।"
	elif lang == "Hinglish":
		summary = f"Ye {error_name} isliye aaya kyunki code me basic setup galat hai."
		meaning = f"Iska matlab program us line ko sahi se chala nahi pa raha. Ye {case['language']} me beginner level par common hai."
		why_it_happens = f"Root cause: {root_cause}. Simple words me, code ka order ya likhne ka tarika mismatch ho gaya."
		fix_steps = [
			"Step 1: Error message me diya hua line number aur naam dhyan se dekho.",
			"Step 2: Jo cheez missing hai (variable/object/syntax), use pehle sahi karo.",
			"Step 3: Code dobara run karo aur agar naya error aaye to usko bhi step-by-step fix karo.",
		]
		common_mistake = "Beginners variable ka naam alag-alag likh dete hain ya define kiye bina use kar dete hain."
		analogy = "Socho aap recipe me gas on kiye bina cooking start kar rahe ho, result nahi aayega."
		pro_tip = "Code chote-chote parts me run karo, bug jaldi pakad me aata hai."
	else:
		summary = f"This {error_name} happens because a basic part of the code setup is wrong."
		meaning = f"It means the program cannot correctly run that line. This is a very common beginner issue in {case['language']} code."
		why_it_happens = f"Root cause: {root_cause}. In simple words, the code order or writing style does not match what the program expects."
		fix_steps = case["fix_steps_en"]
		common_mistake = "Beginners often use a name before creating it, or use different spelling in different lines."
		analogy = "It is like trying to call a phone contact that you never saved."
		pro_tip = "Run your code in small chunks and fix one error at a time."

	response = {
		"summary": summary,
		"meaning": meaning,
		"why_it_happens": why_it_happens,
		"fix_steps": fix_steps,
		"example_code": example_code,
		"common_mistake": common_mistake,
		"analogy": analogy,
		"pro_tip": pro_tip,
	}
	return response


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="CodeMitra: beginner-friendly code error explainer")
	parser.add_argument("--user-input", default="", help="Error message or code snippet")
	parser.add_argument("--language", default="English", help="Hindi | Hinglish | English")
	return parser.parse_args()


def main() -> None:
	args = parse_args()
	result = build_response(args.user_input, args.language)
	print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
	main()
