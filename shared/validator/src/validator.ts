import { Compile } from "typebox/compile";
import Format from "typebox/format";
import type { Static, TObject } from "typebox";
import { phoneNumberLength } from "@repo/config-static";
import { digitFixer } from "@repo/shared-utils";

export const formats = {
	number: /^[0-9]+$/,
	persian: /^[\u0600-\u06FF0123456789\s]+$/,
	english: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
	mobileInText:
		/(9|989)\W?(14|13|12|19|18|17|15|16|11|10|90|91|92|93|94|95|96|32|30|33|35|36|37|38|39|00|01|02|03|04|05|41|20|21|22|23|31|34|9910|9911|9913|9914|9999|999|990|9810|9811|9812|9813|9814|9815|9816|9817|998)\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}\W?\d{1}/,
};

type validation<T> = { isValid: false; errors: { [key: string]: string[] } } | { isValid: true; data: T };
export function validator<T extends Record<string, any>, S extends TObject>({ data, schema }: { data: T; schema: S }): validation<Static<typeof schema>> {
	if (typeof data !== "object" || data === null) {
		return { isValid: false, errors: { base: ["data is not in correct order"] } };
	}

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
			let text = digitFixer(data[key]);
			if ((schema?.properties?.[key] as any)?.format === "mobile") text = text.match(/\d+/g)?.join("") ?? text;
			(data as any)[key] = text;
		}
	}

	const validations: { [key: string]: string[] } = {};
	const compiled = Compile(schema);

	const errors = compiled.Errors(data);

	if (errors.length) {
		errors.forEach((e) => {
			const keyword = e.keyword;
			const key = e.instancePath.substring(1);

			if (keyword === "required") {
				e.params.requiredProperties.forEach((i) => {
					if (!validations[i]) validations[i] = [e.message];
					else validations[i].push(e.message);
				});
			} else {
				if (keyword === "type") {
					if (typeof e.params.type === "string") {
						const errorMessage = typeError(e.params.type);

						if (!validations[key]) validations[key] = [errorMessage];
						else validations[key].push(errorMessage);
					} else {
						// TODO log exception
						console.log("error string[] params type");
					}
				} else {
					if (!validations[key]) validations[key] = [errMessage(keyword, e.params)];
					else validations[key].push(errMessage(keyword, e.params));

					// errMessage(e.keyword, e.params);
				}
			}
		});

		return { errors: validations, isValid: false };
	}

	return { data: compiled.Clean(data) as Static<typeof schema>, isValid: true };
}

function typeError(type: string) {
	switch (type) {
		case "string":
			return "لطفاً مقدار را به صورت نوشتاری وارد نمایید";

		case "integer":
		case "number":
			return "لطفاً مقدار را به صورت عددی وارد نمایید";

		case "array":
			return "لطفاً لیست مقادیر را وارد نمایید";

		case "union":
		case "enum":
		case "boolean":
			return "لطفاً یک گزینه را انتخاب نمایید";

		default:
			return `لطفاً مقدار را به صورت ${type} وارد نمایید`;
	}
}

function errMessage(keyword: keywords, params: any) {
	switch (keyword) {
		case "additionalProperties":
			return "بسته مقادیر ناشناس";

		case "maximum":
			return `حداکثر مقدار قابل قبول ${params.limit} است.`;

		case "minimum":
			return `حداقل مقدار قابل قبول ${params.limit} است.`;

		case "maxLength":
			return `اطلاعات وارد شده بلند است. کمتر از ${params.limit} کاراکتر وارد نمایید.`;
		case "minLength":
			return `اطلاعات وارد شده کوتاه است. بیش از ${params.limit} کاراکتر وارد نمایید.`;

		case "format":
			switch (params.format) {
				case "persian":
					return "لطفاً اطلاعات این فیلد را فقط با استفاده از حروف فارسی وارد نمایید";

				case "english":
					return "فقط می‌توانید از حروف انگلیسی، اعداد و کاراکتر '-' در میان استفاده نمایید.";

				case "number":
					return "لطفاً تنها از اعداد استفاده نمایید";

				default:
					return "لطفاً با الگوی صحیح ارسال نمایید";

				case "mobile":
					return "لطفاً شماره موبایل را به صورت صحیح وارد نمایید";

				case "date-time":
					return "تاریخ را به صورت صحیح وارد نمایید";
			}

		case "enum":
		case "boolean":
			return "لطفاً یک گزینه را انتخاب نمایید";

		default:
			return `خطای ناشناس : ${keyword} ${JSON.stringify({ params })} `;
	}
}

type keywords =
	| "boolean"
	| "format"
	| "additionalProperties"
	| "anyOf"
	| "const"
	| "contains"
	| "dependencies"
	| "dependentRequired"
	| "enum"
	| "exclusiveMaximum"
	| "exclusiveMinimum"
	| "~guard"
	| "if"
	| "maximum"
	| "maxItems"
	| "maxLength"
	| "maxProperties"
	| "minimum"
	| "minItems"
	| "minLength"
	| "minProperties"
	| "multipleOf"
	| "not"
	| "oneOf"
	| "pattern"
	| "propertyNames"
	| "~refine"
	| "required"
	| "type"
	| "unevaluatedItems"
	| "unevaluatedProperties"
	| "uniqueItems";
