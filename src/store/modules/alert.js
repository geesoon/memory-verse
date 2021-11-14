const state = {
	isAlert: false,
	message: "",
	type: "info",
};

const getters = {
	getAlert: (state) => {
		return state;
	},
};

const mutations = {
	setAlert(state, { isAlert = true, message = "", type = "info" }) {
		state.isAlert = isAlert;
		state.message = message;
		state.type = type;
	},
	countDownDismiss(state) {
		setTimeout(() => {
			state.isAlert = false;
		}, 5000);
	},
};

const actions = {
	setAlert(context, alert) {
		context.commit("countDownDismiss");
		context.commit("setAlert", alert);
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
