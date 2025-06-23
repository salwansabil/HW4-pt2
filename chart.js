//File: chart.js
//GUI Assignment: Creating an Interactive Dynamic Table
//Salwan Sabil, UMass Lowell Computer Science, salwan_sabil@student.uml.edu
//Copyright (c) 2025 by Salwan. All rights reserved. May be freely copied or
//excerpted for educational purposes with credit to the author.
//updated by SS on June 22, 2025 at 4:30 PM

//created function to check user inputs and then create table
$(document).ready(function() {
    let tabCounter=0;
    function createTable() {
            const vMin = parseInt($("#multiplicandMin").val(), 10);
            const vMax = parseInt($("#multiplicandMax").val(), 10);
            const hMin = parseInt($("#multiplierMin").val(), 10);
            const hMax = parseInt($("#multiplierMax").val(), 10);
            const errorBox = $("#errorBox");
            errorBox.text("");
            //skip when there are missing values
            if ([vMin, vMax, hMin, hMax].some(n=> isNaN(n))) return;
            //mins must be <= to maxes
            if (vMin > vMax || hMin > hMax) {
                errorBox.text("MINIMUM VALUES MUST BE ≤ THEIR MAXIMUMS.");
                return;
            }
            //prevent a table too large
            const totalCells = (vMax - vMin + 1) * (hMax - hMin + 1);
            if (totalCells > 10000) {
                errorBox.text("Table too large. Reduce range.");
                return;
            }

            //build table
            let html = '<table class="table table-bordered table-sm text-center">';
            html += '<thead><tr><th></th>';
            for (let h = hMin; h <= hMax; h++) html += `<th>${h}</th>`;
            html += '</tr></thead><tbody>';

            for (let v = vMin; v <= vMax; v++) {
                html += `<tr><th>${v}</th>`;
                for (let h = hMin; h <= hMax; h++) html += `<td>${v * h}</td>`;
                html += '</tr>';
            }
            html += '</tbody></table>';
            $("#tableContainer").html(html);
            return {
                html, vMin, vMax, hMin, hMax
            };
        }
    //jQuery validation plugin    
    $("#tableInput").validate({
        //validation rules (can't be blank, needs to be a number, between -50 and 50)
        rules: {
            multiplicandMin: {
                required: true, number: true, range: [-50, 50]
            },
            multiplicandMax: {
                required: true, number: true, range: [-50, 50]
            },
            multiplierMin: {
                required: true, number: true, range: [-50, 50]
            },
            multiplierMax: {
                required: true, number: true, range: [-50, 50]
            }
        },
        //message to user if validation doesn't work
        messages: {
            multiplicandMin: {
                required: "Enter a number for Min Multiplicand.", number: "Must be a number.", range: "Value must be between -50 and 50."
            },
            multiplicandMax: {
                required: "Enter a number for Max Multiplicand.", number: "Must be a number.", range: "Value must be between -50 and 50."
            },
            multiplierMin: {
                required: "Enter a number for Min Multiplier.", number: "Must be a number.", range: "Value must be between -50 and 50."
            },
            multiplierMax: {
                required: "Enter a number for Max Multiplier.", number: "Must be a number.", range: "Value must be between -50 and 50."
            }
        },
        //display message right after the input area
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        //will run only if validation is successful
        submitHandler: function (form) {
            const result=createTable();
            if (!result) return;
            //tab label using the 4 parameters
            const { html, vMin, vMax, hMin, hMax } = result;
            const tabID = `tab-${++tabCounter}`;
            const label = `(${vMin} to ${vMax}) × (${hMin} to ${hMax})`;

            //make tab header with chekcbox
            const tabHeader = `
                <li id="li-${tabID}">
                    <a href="#${tabID}">${label}</a>
                    <input type="checkbox" class="tabCheckbox ms-2" style="display:none;">
                    <span class="ui-icon ui-icon-close" role="presentation">Remove</span>
                </li>`;

            //tab content
            const tabContent = `<div id="${tabID}">${html}</div>`;

            //append to tabs
            $("#myTabs ul").append(tabHeader);
            $("#myTabs").append($(tabContent));

            //refresh widget
            $("#myTabs").tabs("refresh");

            //swap to new tab
            const index = $("#myTabs ul li").length - 1;
            $("#myTabs").tabs("option", "active", index);

            //delete multiple tabs ny clicking x icon
            $(`#li-${tabID} .ui-icon-close`).click(function () {
                const panelId = $(this).closest("li").remove().attr("aria-controls");
                $(`#${panelId}`).remove();
                $("#myTabs").tabs("refresh");
            });

            //toggle checkboxes to delete more than one tab
            $("#selectMultiple").change(function () {
                $(".tabCheckbox").toggle(this.checked);
            });

            //multiple tabs deletion
            $("#deleteTabsBtn").click(function () {
                $(".tabCheckbox:checked").each(function () {
                const li = $(this).closest("li");
                const panelId = li.attr("aria-controls");
                li.remove();
                $(`#${panelId}`).remove();
            });
            $("#myTabs").tabs("refresh");
        });
        }
    });
    //jQuery ui sliders
    const sliders = [
        { input: "#multiplicandMin", slider: "#slider-multiplicandMin" },
        { input: "#multiplicandMax", slider: "#slider-multiplicandMax" },
        { input: "#multiplierMin", slider: "#slider-multiplierMin" },
        { input: "#multiplierMax", slider: "#slider-multiplierMax" }
    ];

    sliders.forEach(pair => {
        $(pair.slider).slider({
            //still needs to be between -50 and 50
            min: -50, max: 50, value: parseInt($(pair.input).val()) || 0, slide: function (event, ui) {
                $(pair.input).val(ui.value); //as the slider is changed the input will also change
                createTable();
            }
        });

        //keep updating slider when user puts in an input
        $(pair.input).on("input", function () {
            const val = parseInt(this.value);
            //still needs to be between -50 and 50
            if (!isNaN(val) && val >= -50 && val <= 50) {
                $(pair.slider).slider("value", val);
                //dynamically change the table
                createTable();
            }
        });
    });
    //initialize tabs widget
    $("#myTabs").tabs();
});
