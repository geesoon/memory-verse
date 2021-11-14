import firebase from "firebase";

export default {
	async getCollection(userId) {
		const db = firebase.firestore();
		try {
			let collection = [];
			await db
				.collection("users")
				.doc(userId)
				.collection("collection")
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						collection.push({
							id: doc.id,
							name: doc.data().name,
							lastReview: doc.data().lastReview.seconds,
							reviewPeriod: doc.data().reviewPeriod,
						});
					});
				});
			return { valid: true, res: collection };
		} catch (err) {
			return { valid: false, res: err };
		}
	},
};
