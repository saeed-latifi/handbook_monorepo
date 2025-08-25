// utils/keyGenerator.ts
export function keyGenerator<F extends Record<string, any> | undefined = undefined>(domainName: string, filters?: F): string {
	// Recursively clean null/undefined values and sort keys
	const cleanObject = (obj: Record<string, any>): Record<string, any> => {
		const cleaned: Record<string, any> = {};
		const entries = Object.entries(obj)
			.filter(([_, value]) => value !== undefined && value !== null) // Exclude undefined/null
			.sort(([a], [b]) => a.localeCompare(b)); // Sort keys alphabetically

		for (const [key, value] of entries) {
			if (value && typeof value === "object" && !Array.isArray(value)) {
				// Recursively clean nested objects
				cleaned[key] = cleanObject(value);
			} else {
				cleaned[key] = value;
			}
		}
		return cleaned;
	};

	// Create the key object
	const keyObj: { name: string; filters?: Record<string, any> } = { name: domainName };
	if (filters) {
		const cleanedFilters = cleanObject(filters);
		if (Object.keys(cleanedFilters).length > 0) {
			keyObj.filters = cleanedFilters;
		}
	}

	// Serialize to JSON
	return JSON.stringify(keyObj);
}

export function KeyParser<F extends Record<string, any> | undefined = undefined>(key: string): { domainName: string; filters?: F } | undefined {
	try {
		const { name, filters } = JSON.parse(key) as { name: string; filters?: F };
		return { domainName: name, filters };
	} catch (e) {
		console.warn(`Failed to parse key: ${key}`, e);
	}
}
