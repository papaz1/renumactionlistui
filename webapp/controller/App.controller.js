sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller, MessageToast) => {
	"use strict";

	return Controller.extend("renumactionlistui.controller.App", {	
		onInit: function() {
		
			//This setting controls the width of components in the view
			//so that they are all aligned.
			var oViewModel = new sap.ui.model.json.JSONModel({
				widthPercentage: "40%" // This is the parameter
			});
			this.getView().setModel(oViewModel, "view");
			this._manifestData = this.getOwnerComponent().getManifestEntry("sap.app");
			this._renumberActionListUri = this._manifestData.dataSources.RenumberActionList.uri;
		},
				
		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			aFileTypes.map(function(sType) {
				return "*." + sType;
			});
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Please choose a CSV file.");
		},

		handleFileChange: function(oEvent){
			var controllerContext = this;

			var oButton = controllerContext.getView().byId("renumberButton");
			oButton.setEnabled(false); // Button should be enabled only if a valid file is chosen

			var oTextArea = controllerContext.getView().byId("logTextArea");
			oTextArea.setValue("");

			var oFileUploader = oEvent.getSource();
			var sFileName = oFileUploader.getValue(); // Get the selected file name

			if (sFileName) {
			
				// Enable the button when a valid file is selected
				var oButton = controllerContext.getView().byId("renumberButton");
				oButton.setEnabled(true); // Enable the button
    		}
		},

		onRenumberPress: async function() {
			var controllerContext = this;
			try {

				// Get the FileUploader control
				var oFileUploader = controllerContext.getView().byId("fileUploader");
		
				// Get the file input element by ID
				var oFileInput = document.getElementById(oFileUploader.getId() + "-fu");
		
				// Create FormData and append the file
				var oFormData = new FormData();
				oFormData.append("file", oFileInput.files[0]); // Using the key "file" and the first file
		
				// Show Busy Indicator
				sap.ui.core.BusyIndicator.show(0); // Show busy indicator with 0 ms delay
		
				// Send the POST request using fetch (await for the response)
				const response = await fetch(this._renumberActionListUri, {
					method: "POST",
					body: oFormData
				});
				
				oFileUploader.clear();
				var oButton = controllerContext.getView().byId("renumberButton");
				oButton.setEnabled(false);
				
				// Check if the response is OK (status 200-299)
				if (!response.ok) {
				
					// Error: Handle error by reading the response as text
					const errorMessage = await response.text();
					var oTextArea = this.getView().byId("logTextArea");
					oTextArea.setValue("Error:\n" + errorMessage);
				} else {
				
					// Success: Read the response as Blob
					const blob = await response.blob();
		
					// Create a download link and trigger download
					const link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = response.headers.get("Content-Disposition").split('filename=')[1].replace(/"/g, '');
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
		
					// Set success message in TextArea
					var oTextArea = this.getView().byId("logTextArea");
					oTextArea.setValue("Success:\nA new file with renumbered Activity IDs has been created.");
				}
			} catch (error) {
				
				// Handle unexpected errors (network issues, etc.)
				MessageToast.show("Error uploading file: " + error.message);
			} finally {
				
				// Always hide Busy Indicator, whether success or error
				sap.ui.core.BusyIndicator.hide();
			}
		}		
	});
});