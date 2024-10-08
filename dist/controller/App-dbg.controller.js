sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], (Controller, MessageToast) => {
	"use strict";

	return Controller.extend("renumactionlistui.controller.App", {		
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

		onRenumberPress: function() {
	
			// Get the FileUploader control
			var oFileUploader = this.getView().byId("fileUploader");

			//Get the file input element by ID
    		var oFileInput = document.getElementById(oFileUploader.getId() + "-fu"); // The ID of the input element
			 
			// Create and populate parameters to a FormData object
			var oFormData = new FormData();
			oFormData.append("file", oFileInput.files[0]); // Using the key "file" and the first file
			
			// Create a new XMLHttpRequest
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "http://localhost:8080/renumberactionlist", true);
			
			// Set response type to blob
			xhr.responseType = "blob";
			var controllerContext = this; 

			xhr.onload = function() {
				if (xhr.status === 200) {
		
					// Create a blob from the response
					var blob = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") });
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = xhr.getResponseHeader("Content-Disposition").split('filename=')[1].replace(/"/g, '');
					
					// Automatically click the link to trigger the download
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);					
					
					// Set static text in the TextArea after successful upload
					var oTextArea = controllerContext.getView().byId("logTextArea");
					oTextArea.setValue("Success:\nNew file with renumbered Activity ID's generated successfully.");
				} else {
					//Handle errors
				}
			};
		
			xhr.onerror = function() {
				MessageToast.show("Error uploading file.");
			};
		
			// Send the FormData
			xhr.send(oFormData);
		},
	});
});