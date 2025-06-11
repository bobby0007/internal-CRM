export const API_BASE_URL = "https://metaverse.otpless.app/internal-dashboard/";

export const API_ENDPOINTS = {
	MERCHANT: {
		GET_DETAILS: "merchant-details/get",
		UPDATE_DETAILS: "merchant-details/update",
		UPDATE_INTERNATIONAL: "merchant-details/update-international",
	},
	RATE_LIMIT: {
		GET_INFO: "rate-limit/get",
		UPDATE: "rate-limit/update",
	},
	CONFIG: {
		GET_INFO: "merchant-config/get",
		UPDATE: "merchant-config/update",
	},
	AUTH: {
		LOGIN: "/auth/login",
	},
	TEMPLATE: {
		GET_CATALOG: "template/catalog/get",
		UPDATE: "template/catalog/update",
		CREATE: "template/create",
	},
} as const;
