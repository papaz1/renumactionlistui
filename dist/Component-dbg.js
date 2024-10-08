sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], (UIComponent, JSONModel, ResourceModel) => {
	"use strict";

	return UIComponent.extend("renumactionlistui.Component", {
		metadata: {
			"interfaces": ["sap.ui.core.IAsyncContentCreation"],
			"rootView": {
				"viewName": "renumactionlistui.view.App",
				"type": "XML",
				"id": "app"
			}
		},

		init() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set data model on view
			const oData = {
				recipient: {
					name: "World"
				}
			};
			const oModel = new JSONModel(oData);
			this.setModel(oModel);

			// set i18n model on view
			const i18nModel = new ResourceModel({
				bundleName: "renumactionlistui.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");
		}
	});
});
