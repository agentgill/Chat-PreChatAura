({
    /**
     * Map of pre-chat field label to pre-chat field name (can be found in Setup)
     */
    fieldLabelToName: {
        "First Name": "FirstName",
        "Last Name": "LastName",
        Email: "Email",
        Subject: "Subject"
    },

    /**
     * Event which fires the function to start a chat request (by accessing the chat API component)
     *
     * @param cmp - The component for this state.
     */
    onStartButtonClick: function(cmp) {
        var prechatFieldComponents = cmp.find("prechatField");
        var fields;

        // Make an array of field objects for the library
        fields = this.createFieldsArray(prechatFieldComponents);

        // If the pre-chat fields pass validation, start a chat
        if (
            fields[0].value &&
            fields[0].value != "First Name" &&
            fields[1].value && fields[1].value != "Last Name" &&
            fields[2].value && fields[2].value != "Email" &&
            fields[3].value && fields[3].value != "Subject"
        ) {
            if (cmp.find("prechatAPI").validateFields(fields).valid) {
                cmp.find("prechatAPI").startChat(fields);
            } else {
                console.warn("Prechat fields did not pass validation!");
            }
        } else {
            if (fields[0].value === "First Name") {
                window.alert("First Name is required!");
            } else if (fields[1].value === "Last Name") {
                window.alert("Last Name is required!");
            } else if (fields[2].value === "Email") {
                window.alert("Email is required!");
            } else if (fields[3].value === "Subject") {
                window.alert("Subject is required!");
            } else {
                window.alert("All fields are required!");
            }
        }
    },

    /**
     * Create an array of field objects to start a chat from an array of pre-chat fields
     *
     * @param fields - Array of pre-chat field Objects.
     * @returns An array of field objects.
     */
    createFieldsArray: function(fields) {
        if (fields.length) {
            return fields.map(
                function(fieldCmp) {
                    return {
                        label: fieldCmp.get("v.label"),
                        value: fieldCmp.get("v.value"),
                        name: this.fieldLabelToName[fieldCmp.get("v.label")]
                    };
                }.bind(this)
            );
        } else {
            return [];
        }
    },

    /**
     * Create an array in the format $A.createComponents expects
     *
     * Example:
     * [["componentType", {attributeName: "attributeValue", ...}]]
     *
     * @param prechatFields - Array of pre-chat field Objects.
     * @returns Array that can be passed to $A.createComponents
     */
    getPrechatFieldAttributesArray: function(prechatFields) {
        // $A.createComponents first parameter is an array of arrays. Each array contains the type of component being created, and an Object defining the attributes.
        var prechatFieldsInfoArray = [];

        // For each field, prepare the type and attributes to pass to $A.createComponents
        prechatFields.forEach(function(field) {
            var componentName =
                field.name === "Subject" ? "inputTextArea" : "inputText";
            var componentInfoArray = ["ui:" + componentName];
            var attributes = {
                "aura:id": "prechatField",
                required: field.required,
                label: field.label,
                disabled: field.readOnly,
                maxlength: field.maxLength,
                class:
                    field.name === "Subject"
                        ? "form-text-input-area"
                        : "form-text-input",
                value: field.value
            };

            // Special handling for options for an input:select (picklist) component
            if (field.type === "inputSelect" && field.picklistOptions)
                attributes.options = field.picklistOptions;

            // Append the attributes Object containing the required attributes to render this pre-chat field
            componentInfoArray.push(attributes);

            // Append this componentInfoArray to the fieldAttributesArray
            prechatFieldsInfoArray.push(componentInfoArray);
        });

        return prechatFieldsInfoArray;
    }
});
