sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller, MessageToast) => {
	"use strict";

	return Controller.extend("renumactionlistui.controller.App", {		
		handleTypeMissmatch: function(oEvent) {
			console.log("Triggered mismatch");
			var oFile = oEvent.getParameter("files")[0];  // Get the first uploaded file
			var sFileName = oFile.name;
		
			if (!sFileName.endsWith(".csv")) {
				// File extension is valid, proceed with upload or further processing
				sap.m.MessageToast.show("Please upload a valid CSV file.");
			} 		
		},

		onRenumberPress: function() {
			var oFileUploader = this.byId("fileUploader");
			oFileUploader.checkFileReadable().then(function() {
				oFileUploader.upload();
			}, function(error) {
				MessageToast.show("Error: The file cannot be read.");
			}).then(function() {
				oFileUploader.clear();
			});
		}
	});
});