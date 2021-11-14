import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: "#06ba63",
				secondary: "#103900",
				background: "#f5f5f5",
				action: "#0fff95",
			},
		},
	},
});
