import { Compile } from "typebox/compile";
import Format from "typebox/format";
// import { digitFixer } from "./textFixer";
import type { Static, TObject } from "typebox";
import type { TLocalizedValidationError } from "typebox/error";
import { phoneNumberLength } from "@repo/config-static";

export const formats = {
	number: /^[0-9]+$/,
	persian: /^[\u0600-\u06FF0123456789\s]+$/,
	english: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
	mobileInText:
		/(9|989)\W?(14|13|12|19|18|17|15|16|11|10|90|91|92|93|94|95|96|32|30|33|35|36|37|38|39|00|01|02|03|04|05|41|20|21|22|23|31|34|9910|9911|9913|9914|9999|999|990|9810|9811|9812|9813|9814|9815|9816|9817|998)\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}/,
};

type validation<T> = { isValid: false; errors: { [key: string]: string[] } } | { isValid: true; data: T };
export function validator<T extends Record<string, any>, S extends TObject>({ data, schema }: { data: T; schema: S }): validation<Static<typeof schema>> {
	Format.Set("persian", (item) => formats.persian.test(item));
	Format.Set("english", (item) => formats.english.test(item));
	Format.Set("number", (item) => formats.number.test(item));

	Format.Set("mobile", (item) => {
		const isMobile = formats.mobileInText.test(item);
		return item.length === phoneNumberLength && isMobile;
	});

	Format.Set("date-time", (value) => {
		return !isNaN(new Date(value).getTime()); // Simple check
	});

	const properties = schema.properties;

	for (const key in data) {
		if (properties[key] === undefined) {
			delete data[key];
			continue;
		}

		if (typeof data[key] === "string") {
			console.log(schema?.properties?.[key]);

			// let text = digitFixer(data[key]);
			// if (schema?.properties?.[key]?.format === "mobile") text = text.match(/\d+/g)?.join("") ?? text;
			// (data as any)[key] = text;
		}
	}

	const validations: { [key: string]: string[] } = {};
	const compiled = Compile(schema);
	const errors = [...compiled.Errors(data)];

	if (errors.length) {
		errors.forEach((e) => {
			const message = errMessage(e);
			if (!message) return;

			if (!validations[e.schemaPath.substring(1)]) validations[e.schemaPath.substring(1)] = [message];
			else {
				const exist = validations[e.schemaPath.substring(1)]?.find((i) => i === message);
				if (!exist) validations[e.schemaPath.substring(1)]?.push(message);
			}
		});

		return { errors: validations, isValid: false };
	}

	return { data: data as Static<typeof schema>, isValid: true };
}

function errMessage(error: TLocalizedValidationError): string | null {
	console.log("error", error);

	return "";
	if (error.keyword === "required") return null;

	// if (error.type === ValueErrorType.ObjectRequiredProperty) return null;
	// if (error.schema.error) return error.schema.error;

	// switch (error.type) {
	// 	case ValueErrorType.Object:
	// 		if (error.schema.error) return error.schema.error;
	// 		return "بسته مقادیر ناشناس";

	// 	case ValueErrorType.Number:
	// 	case ValueErrorType.Integer:
	// 		return "لطفاً مقدار را به صورت عددی وارد نمایید";

	// 	case ValueErrorType.NumberMaximum:
	// 	case ValueErrorType.IntegerMaximum:
	// 		return `حداکثر مقدار قابل قبول ${error.schema.maximum} است.`;

	// 	case ValueErrorType.NumberMinimum:
	// 	case ValueErrorType.IntegerMinimum:
	// 		return `حداقل مقدار قابل قبول ${error.schema.minimum} است.`;

	// 	case ValueErrorType.String:
	// 		return "اطلاعات این فیلد را تکمیل نمایید";
	// 	case ValueErrorType.StringMaxLength:
	// 		return `اطلاعات وارد شده بلند است. کمتر از ${error.schema.minLength} کاراکتر وارد نمایید.`;
	// 	case ValueErrorType.StringMinLength:
	// 		return `اطلاعات وارد شده کوتاه است. بیش از ${error.schema.minLength} کاراکتر وارد نمایید.`;
	// 	case ValueErrorType.StringFormat:
	// 		switch (error.schema.format) {
	// 			case "persian":
	// 				return "لطفاً اطلاعات این فیلد را فقط با استفاده از حروف فارسی وارد نمایید";
	// 			case "english":
	// 				return "فقط می‌توانید از حروف انگلیسی، اعداد و کاراکتر '-' در میان استفاده نمایید.";
	// 			case "number":
	// 				return "لطفاً تنها از اعداد استفاده نمایید";
	// 			default:
	// 				return "لطفاً با الگوی صحیح ارسال نمایید";
	// 			case "mobile":
	// 				return "لطفاً شماره موبایل را به صورت صحیح وارد نمایید";

	// 			case "date-time":
	// 				return "تاریخ را به صورت صحیح وارد نمایید";
	// 		}

	// 	case ValueErrorType.Boolean:
	// 		return "لطفاً یک گزینه را انتخاب نمایید";
	// 	case ValueErrorType.Array:
	// 		return "لطفاً لیست مقادیر را وارد نمایید";
	// 	case ValueErrorType.Union:
	// 		return "لطفاً از میان گزینه ها انتخاب نمایید ";

	// 	case ValueErrorType.Intersect:
	// 		return null;

	// 	default:
	// 		return `خطای ناشناس : ${error.message} ${error.type} ${error.value}`;
	// }
}
