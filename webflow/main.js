function togglePaymentPeriod() {
    var payment_period = $("#Payment-Period").val()
    if (payment_period == "day") {
        $(".slider-container-monthly").css("display", "none")
        $(".slider-container-daily").css("display", "display")
    } else {
        $(".slider-container-monthly").css("display", "display")
        $(".slider-container-daily").css("display", "none")
    }   
}

function setupSliders() {
    $("#Payment-Period").change(function() {
        togglePaymentPeriod();
        updateCalculations();
    });

    $(".button").click(function() {
        togglePaymentPeriod();
        // Need to wait for the sliders to appear before recalculating
        setTimeout(updateCalculations, 500);
        updateCalculations();
    });

    $("#wage-slider-monthly").ionRangeSlider({
        grid: true,
        min: 0,
        max: 10000,
        from: 1000,
        prefix: "R",
        postfix: " / month",
        hide_min_max: true,
        decorate_both: true,
        force_edges: true,
        step: 100,
        onChange: updateCalculations
    });
    $("#wage-slider-daily").ionRangeSlider({
        grid: true,
        min: 0,
        max: 1000,
        from: 200,
        prefix: "R",
        postfix: " / day",
        hide_min_max: true,
        decorate_both: true,
        force_edges: true,
        step: 25,
        onChange: updateCalculations
    });
    $("#household-size").ionRangeSlider({
        grid: true,
        min: 1,
        max: 20,
        from: 3,
        /*prefix: "$",*/
        postfix: " People",
        hide_min_max: true,
        decorate_both: true,
        force_edges: true,
        step: 1,
        onChange: updateCalculations,
    });
    $("#food-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 200,
        /*from_min: 20,*/
        from: 20,
        prefix: "R",
        postfix: " / person per day",
        hide_min_max: true,
        force_edges: true,
        step: 5,
        onChange: updateCalculations
    });
    $("#transport-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 100,
        /*from_min: 20,*/
        from: 10,
        prefix: "R",
        postfix: " / trip",
        hide_min_max: true,
        force_edges: true,
        step: 1,
        onChange: updateCalculations
    });
    $("#housing-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 5000,
        /*from_min: 20,*/
        from: 500,
        prefix: "R",
        postfix: " / month",
        hide_min_max: true,
        force_edges: true,
        step: 50,
        onChange: updateCalculations
    });
    $("#utilities-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 2000,
        /*from_min: 20,*/
        from: 100,
        prefix: "R",
        postfix: " / month",
        hide_min_max: true,
        force_edges: true,
        step: 25,
        onChange: updateCalculations
    });
    $("#healthcare-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 300,
        /*from_min: 20,*/
        from: 50,
        prefix: "R",
        postfix: " / person per month",
        hide_min_max: true,
        force_edges: true,
        step: 10,
        onChange: updateCalculations
    });
    $("#hygiene-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 1500,
        /*from_min: 20,*/
        from: 100,
        prefix: "R",
        postfix: " / month",
        hide_min_max: true,
        force_edges: true,
        step: 50,
        onChange: updateCalculations
    });
    $("#education-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 2000,
        /*from_min: 20,*/
        from: 500,
        prefix: "R",
        postfix: " / child per month",
        hide_min_max: true,
        force_edges: true,
        step: 50,
        onChange: updateCalculations
    });
    $("#communication-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 1000,
        /*from_min: 20,*/
        from: 100,
        prefix: "R",
        postfix: " / person per month",
        hide_min_max: true,
        force_edges: true,
        step: 25,
        onChange: updateCalculations
    });
    $("#recreation-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 1000,
        /*from_min: 20,*/
        from: 200,
        prefix: "R",
        postfix: " / person per month",
        hide_min_max: true,
        force_edges: true,
        step: 25,
        onChange: updateCalculations
    });
    $("#other-cost").ionRangeSlider({
        grid: true,
        min: 0,
        max: 2000,
        /*from_min: 20,*/
        from: 100,
        prefix: "R",
        postfix: " / month",
        hide_min_max: true,
        force_edges: true,
        step: 25,
        onChange: updateCalculations
    });
}

var days_per_month = 21.3;
var default_day_rate = 300;

function fmt_money(val) {
    return "R " + val.toLocaleString();
}

function fmt_perc(val) {
    return (val * 100).toFixed(0) + "%";
}

function updatePercentage(monthly_cost) {
    if (!monthly_cost) return;

    var monthly_income = default_day_rate;
    var payment_period = $("#Payment-Period").val()

    if (payment_period == "day") {
        var period_rate = $("#wage-slider-daily").data().from;
        monthly_income =  period_rate * days_per_month;
    } else {
        var period_rate = $("#wage-slider-monthly").data().from;
        monthly_income = period_rate;
    }   

    togglePaymentPeriod();

    var perc = monthly_income / monthly_cost;

    $(".percentage-covered").text(fmt_perc(perc));
    if (perc >= 1) {
        $(".percentage-covered").addClass("green");
    } else {
        $(".percentage-covered").removeClass("green");
    }
    $(".expense-total").text(fmt_money(monthly_cost));
}

function updateCalculations(data) {
    var household_size = $("#household-size").data().from;
    var food_cost = $("#food-cost").data().from * household_size;
    var transport_coefficient = $("#Trip-type-2").val() == "one way" ? 1 : 2;
    var transport = $("#transport-cost").data().from * transport_coefficient * days_per_month;

    var household = $("#housing-cost").data().from;
    var utilities = $("#utilities-cost").data().from;
    var healthcare = $("#healthcare-cost").data().from * household_size;
    var hygiene = $("#hygiene-cost").data().from * household_size;
    var school_children = parseInt($("#School-going-children").val());
    var school = $("#education-cost").data().from * school_children;
    var communication = $("#communication-cost").data().from * household_size;
    var recreation = $("#recreation-cost").data().from * household_size;
    var other = $("#other-cost").data().from;

    var total_cost = food_cost + transport + household + utilities + healthcare + hygiene + school + communication + recreation + other;

    if (total_cost) {

        console.log(total_cost);
        updatePercentage(total_cost);
    }
}

$("#Trip-type-2").change(function(e) {
    updateCalculations();
})

$("#School-going-children").change(function(e) {
    updateCalculations();
})

$("#Payment-Period").change(function(e) {
    updateCalculations();
});

$("#Budget").change(function(e) {
    updateCalculations();
});

$(function() {
    setupSliders();
    updateCalculations();
});
