/*
Name: Sony Thach 
Email: sony_thach@student.uml.edu   
Comp.4610, GUI Programming I   
Description: Assignment 5
*/
$(document).ready(function () {

    /* bind Parsley to forms for input validations */
    $('#rowcolumnsForm').parsley();
    $('#priceEntryForm').parsley();
    $('#mpgEntryForm').parsley();
    $('#financeForm').parsley();
    $('#leaseForm').parsley();

    /* submit number of prices and mpgs along with purchase options of finance or lease */
    $("#rowColumnsForm").on("submit", function (event) {
        event.preventDefault();

        $("#financeTable tr").remove();
        $("#leaseTable tr").remove();

        var columns = 0;
        var rows = 0;

        /*
        obtain how many inputs will enter for prices and miles per gallon 
        */
        columns = document.getElementById("numberOfColumns").value;
        console.log("FIRSTFORM Prices: " + columns);
        rows = document.getElementById("numberOfRows").value;
        console.log("FIRSTFORM Columns: " + rows);


        var htmlToAdd = "";

        $('#priceEntryForm').parsley().destroy();
        var priceForm = document.getElementById("priceEntryForm");
        
        /* create labels and fields for user to input prices */
        for (var i = 1; i < parseInt(columns, 10) + 1; i++) {
            htmlToAdd += "<label for=\"price" + i + "\" class= \"dynamicColumnInput\"> Price" + i + ":</label>";
            htmlToAdd += "<input id=\"price" + i + "\" class= \"dynamicColumnInput\"><br>";
            priceForm.innerHTML = htmlToAdd;
        }

        // add validator attributes to dynamically created price input fields
        for (var i = 1; i < parseInt(columns, 10) + 1; i++) {
            $('#price' + i).attr("data-parsley-required", "true");
            $('#price' + i).attr("data-parsley-pattern", "\\d+\\.?\\d{0,2}$");
            $('#price' + i).attr("min", ".01");
        }
        $('#priceEntryForm').parsley();

        $('#priceEntryForm').css('display', 'block');
        console.log(document.getElementById("priceEntryForm").innerHTML);


        htmlToAdd = '';
        $('#mpgEntryForm').parsley().destroy();
        var mpgForm = document.getElementById("mpgEntryForm");
                
        /* create input and fields for user to input miles per gallon values */
        for (var i = 1; i < parseInt(rows, 10) + 1; i++) {
            htmlToAdd += "<label for=\"mpg" + i + "\"> MPG" + i + ":</label>"
            htmlToAdd += "<input id=\"mpg" + i + "\" type=\"number\"><br>";
            mpgForm.innerHTML = htmlToAdd;
        }

        // add validator attributes to dynamically created price input fields
        for (var i = 1; i < parseInt(rows, 10) + 1; i++) {
            $('#mpg' + i).attr("data-parsley-required", "true");
            $('#mpg' + i).attr("data-parsley-type", "digits");
            $('#mpg' + i).attr("min", "1");

        }
        $('#mpgEntryForm').parsley();

        $('#mpgEntryForm').css('display', 'block');


        var financeCheck = document.getElementById("finance").checked;
        var leaseCheck = document.getElementById("lease").checked;

        /* if finance option selected then show finance form to user */
        if (financeCheck === true) {
            document.getElementById("financeForm").style.display = "table";
            document.getElementById("leaseForm").style.display = "none";
            document.getElementById("leaseTable").style.display = "none";

            $("#financeForm").on("submit", function (event) {
                event.preventDefault();
                htmlToAdd = "";

                // validate entries for prices, mpgs, and purchasing details
                $("#priceEntryForm").parsley().validate();
                $('#mpgEntryForm').parsley().validate();

                if (($("#priceEntryForm").parsley().isValid()) === false || ($('#mpgEntryForm').parsley().isValid()) === false) {
                    return false;
                }

                document.getElementById("financeTable").style.display = "table";
                document.getElementById("leaseTable").style.display = "none";

                /* store table header html in a string */
                htmlToAdd = "<tr><th>Price/Fuel Consumption</th>";

                $("#financeTable").html(htmlToAdd);

                /* store column headers html in string */
                columns = document.getElementById("numberOfColumns").value;
                for (var i = 1; i < parseInt(columns) + 1; i++) {
                    htmlToAdd += "<td>Price" + i + "</td>";
                }
                htmlToAdd += "</tr>";
                /* insert table headers in table html */
                $("#financeTable").html(htmlToAdd);

                rows = document.getElementById("numberOfRows").value;

                /* store row headers and body cells html in string */
                for (var i = 1; i < parseInt(rows) + 1; i++) {

                    htmlToAdd += "<tr>";
                    $("#financeTable").html(htmlToAdd);

                    for (var j = 1; j < parseInt(columns) + 1; j++) {
                        if (parseInt(j) === 1) {
                            htmlToAdd += "<td>MPG" + i + "</td>";
                        }
                        htmlToAdd += "<td></td>";
                    }
                    htmlToAdd += "</tr>";
                    console.log("Table: " + htmlToAdd);
                    /* add table row headers and body html into table html */
                    $("#financeTable").html(htmlToAdd);
                }
                /*
                variables that will be used to calculate cost per month and cost per mile
                */
                var interestPaid = 0;
                var totalGasCost = 0;
                var totalPayment = 0;
                var costPerMile = 0;
                var gasCostPerMonth = 0;
                var output = "";
                var mpgInput = "";
                var priceInput = "";
                var interestRate = ((document.getElementById("interestRate1").value) / 100);
                var estimatedMilesDriven = document.getElementById("estimatedMilesDriven1").value;
                var costPerGallon = document.getElementById("costPerGallon1").value;
                var monthsOfPayment = document.getElementById("monthsOfPayment1").value;
                var interestPaid = 0;

                /* 
                nested for loop that calulates cost per month and cost per mile for each combination of price and miles per gallon and insert them into the table cells.
                */
                for (var i = 1; i < parseInt(rows) + 1; i++) {
                    for (var j = 1; j < parseInt(columns) + 1; j++) {
                        mpgInput = document.getElementById(("mpg" + i)).value;
                        priceInput = document.getElementById(("price" + j)).value;

                        interestPaid = (priceInput * interestRate * monthsOfPayment);
                        gasCostPerMonth = ((estimatedMilesDriven / 12) / mpgInput) * costPerGallon;
                        totalGasCost = ((estimatedMilesDriven / mpgInput) * costPerGallon).toFixed(2);
                        totalPayment = parseInt(priceInput) + interestPaid + gasCostPerMonth;
                        costPerMonth = (totalPayment / monthsOfPayment).toFixed(2);
                        costPerMile = (totalGasCost / estimatedMilesDriven).toFixed(2);
                        output = "Cost Per Month: " + costPerMonth + "<br>Cost Per Mile: " + costPerMile;

                        /* insert results into proper table cell*/
                        $("#financeTable tr:nth-child(" + (parseInt(i) + 1) + ") td:nth-child(" + (parseInt(j) + 1) + ")").html(output);


                    }
                }
                // hide table if input value is changed
                $('#priceEntryForm input').change(function () {
                    document.getElementById("financeTable").style.display = "none";
                });

                $('#mpgEntryForm input').change(function () {
                    document.getElementById("financeTable").style.display = "none";

                });
                $('#financeForm input').change(function () {
                    document.getElementById("financeTable").style.display = "none";

                });
            });

        }
        /* if lease option selected then show finance form to user */
        if (leaseCheck === true) {
            document.getElementById("leaseForm").style.display = "table";
            document.getElementById("financeForm").style.display = "none";
            document.getElementById("financeTable").style.display = "none";

            $("#leaseForm").submit(function (event) {
                event.preventDefault();
                document.getElementById("leaseTable").style.display = "table";
                document.getElementById("financeForm").style.display = "none;"
                document.getElementById("financeTable").style.display = "none";

                // validate entries for prices, mpgs, and purchasing details
                $("#priceEntryForm").parsley().validate();
                $('#mpgEntryForm').parsley().validate();

                if (($("#priceEntryForm").parsley().isValid()) === false || ($('#mpgEntryForm').parsley().isValid()) === false) {
                    return false;
                }

                /* store table header html in a string */
                htmlToAdd = "<tr><th>Price/Fuel Consumption</th>";
                /* insert table headers in table html */
                $("#leaseTable").html(htmlToAdd);

                /* store column headers html in string */
                columns = document.getElementById("numberOfColumns").value;

                for (var i = 1; i < parseInt(columns) + 1; i++) {
                    htmlToAdd += "<td>Price" + i + "</td>";

                }
                htmlToAdd += "</tr>";
                /* insert table headers in table html */
                $("#leaseTable").html(htmlToAdd);

                rows = document.getElementById("numberOfRows").value;

                /* store row headers and body cells html in string */
                for (var i = 1; i < parseInt(rows) + 1; i++) {

                    htmlToAdd += "<tr>";

                    $("#leaseTable").html(htmlToAdd);

                    for (var j = 1; j < parseInt(columns) + 1; j++) {
                        if (parseInt(j) === 1) {
                            htmlToAdd += "<td>MPG" + i + "</td>";
                        }
                        htmlToAdd += "<td></td>";
                    }
                    htmlToAdd += "</tr>";
                    /* add table row headers and body html into table html */
                    $("#leaseTable").html(htmlToAdd);

                }
                /*
                variables that will be used to calculate cost per month and cost per mile
                */
                var milesAllowedPerYear = document.getElementById("milesDrivenAllowed").value;
                var estimatedMilesDriven = document.getElementById("estimatedMilesDriven2").value;
                var leaseCostPerMonth = document.getElementById("leaseMonthlyCost").value;
                var costPerAdditionalMile = document.getElementById("costPerAdditionalMile").value;
                var costPerGallon = document.getElementById("costPerGallon2").value;
                var monthsOfPayment = document.getElementById("monthsOfPayment2").value;
                var excessMiles = parseInt(estimatedMilesDriven) - milesAllowedPerYear;
                if (parseInt(excessMiles) < 0) {
                    excessMiles = 0;
                }
                var excessMilesTotalCost = parseInt(excessMiles) * costPerAdditionalMile;
                var totalLeasingCost = leaseCostPerMonth * monthsOfPayment;
                var totalPayment = 0;
                var totalGasCost = 0;
                if (excessMiles < 0) {
                    excessMiles = 0;
                }
                var costPerMonth2 = 0;
                var costPerMile2 = 0;
                /* 
                nested for loop that calulates cost per month and cost per mile for each combination of price and miles per gallon and insert them into the table cells.
                */
                for (var i = 1; i < parseInt(rows) + 1; i++) {
                    for (var j = 1; j < parseInt(columns) + 1; j++) {
                        mpgInput = document.getElementById(("mpg" + i)).value;
                        priceInput = document.getElementById(("price" + j)).value;
                        totalGasCost = ((estimatedMilesDriven / mpgInput) * costPerGallon).toFixed(2);
                        console.log("totalGasCost: " + totalGasCost);

                        totalPayment = parseInt(totalLeasingCost) + parseInt(excessMilesTotalCost) + parseInt(totalGasCost);
                        console.log("totalPayment: " + totalPayment);

                        costPerMonth2 = (totalPayment / monthsOfPayment).toFixed(2);
                        costPerMile2 = (totalPayment / estimatedMilesDriven).toFixed(2);
                        output = "Cost Per Month: " + costPerMonth2 + "<br>Cost Per Mile: " + costPerMile2;

                        /* insert results into proper table cell*/
                        $("#leaseTable tr:nth-child(" + (parseInt(i) + 1) + ") td:nth-child(" + (parseInt(j) + 1) + ")").html(output);


                    }
                }
                // hide table if input value is changed
                $('#priceEntryForm input').change(function () {
                    document.getElementById("leaseTable").style.display = "none";

                });
                $('#mpgEntryForm input').change(function () {
                    document.getElementById("leaseTable").style.display = "none";

                });
                $('#leaseForm input').change(function () {
                    document.getElementById("leaseTable").style.display = "none";

                });

            });
        }
    });
    // hide table and purchase option forms if input is changed
    $('#rowColumnsForm input').change(function () {
        document.getElementById("financeTable").style.display = "none";
        document.getElementById("leaseTable").style.display = "none";
        document.getElementById("priceEntryForm").style.display = "none";
        document.getElementById("mpgEntryForm").style.display = "none";
        $('#financeForm input').val('');
        $('#leaseForm input').val('');
        document.getElementById("financeForm").style.display = "none";
        document.getElementById("leaseForm").style.display = "none";



    });

    window.Parsley.addValidator('integerValid', {
        validateNumber: function (value) {
            return (Number.parseFloat(value) === Number.parseInt(value) && $.isNumeric(value));
        },
        requirementType: 'integer',
        messages: {
            en: 'Input needs to be an integer!'
        }
    });
});
