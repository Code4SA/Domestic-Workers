var constants = {};

function to_rands(val) {
    if (val != parseInt(val)){
        return "R" + val.toFixed(2);
    }
    else {
        return "R" + val;
    }
}

function calculate_transport(household_size) {
    var trans_cost = $("#transport-cost").val();
    var trans_direction = $("#transport-direction").val();
    if (trans_direction == "oneway")
        var out = Math.round(2 * trans_cost * constants.workdays_per_month);
    else
        var out = Math.round(trans_cost * constants.workdays_per_month);

    $("#transport-total").html(to_rands(out));

    return out
}

function calculate_food(household_size) {
    var food_cost = $("#food-cost").val();
    var out = Math.round(food_cost * household_size * constants.days_per_month);

    $("#food-total").html(to_rands(out));

    return out
}

function calculate_rent(household_size) {
    var rent_cost = $("#rent-cost").val();
    var out = Math.round(rent_cost)


    $("#rent-total").html(to_rands(out));

    return out
}

function calculate_utilities(household_size) {
    var utilities_cost = $("#utilities-cost").val();
    var out = Math.round(utilities_cost)

    $("#utilities-total").html(to_rands(out));

    return out
}

function calculate_hygiene(household_size) {
    var hygiene_cost = $("#hygiene-cost").val();
    var out = Math.round(hygiene_cost)

    $("#hygiene-total").html(to_rands(out));

    return out
}

function calculate_education(household_size) {
    var kids = $("#education-kids").val()
    var education_cost = $("#education-cost").val()
    var out = education_cost * (kids);

    $("#education-total").html(to_rands(out));

    return out
}

function calculate_health(household_size) {

    var health_cost = $("#health-cost").val();
    var out = health_cost * household_size;
    var health_comment = ""

    $("#health-total").html(to_rands(out))

    return out
}

function calculate_communication(household_size) {
    var communication_cost = $("#communication-cost").val();
    var out = communication_cost * household_size

    $("#communication-total").html(to_rands(out))

    return out
}

function calculate_recreation(household_size) {
    var recreation_cost = $("#recreation-cost").val();
    var out = recreation_cost * household_size;

    $("#recreation-total").html(to_rands(out))

    return out
}

function calculate_other(household_size) {
    var out = $("#other-cost").val() * household_size;

    $("#other-total").html(to_rands(out))

    return out
}

function calculate_expenditure(household_size) {
    var total = 0;

    total += calculate_rent(household_size);
    total += calculate_utilities(household_size);
    total += calculate_hygiene(household_size);
    total += calculate_food(household_size);
    total += calculate_transport(household_size);
    total += calculate_education(household_size);
    total += calculate_health(household_size);
    total += calculate_communication(household_size);
    total += calculate_recreation(household_size);
    total += calculate_other(household_size);

    return Math.round(total)
}

function highlight_output(class_name) {
    var available_classes = ['label-danger', 'label-warning', 'label-success']
    if ($.inArray(class_name, available_classes) > -1) {
        for (var i = 0; i < available_classes.length; i++)
        {
            var tmp = available_classes[i];
            $("#output-percentage").removeClass(tmp);
        }
        $("#output-percentage").addClass(class_name);
    }
}


function update_display(class_name) {
    var transition_time = constants.transition_time;
    var available_classes = ['display-landing', 'display-results', 'display-assumptions']

    if ($.inArray(class_name, available_classes) > -1) {

        for (var i = 0; i < available_classes.length; i++)
        {
            var tmp = available_classes[i];
            // hide some stuff
            if (tmp != class_name) {
                $("." + tmp).each(function() {
                    if (!$(this).hasClass(class_name)) {
                        $(this).slideUp(transition_time);
                    }
                });
            }

            // show some stuff
            $("." + class_name).each(function() {
                $(this).slideDown(transition_time);
            })
        }
    }
}

function validate_input(household_size, pay_rate, pay_amount) {
    if (!$.isNumeric(pay_amount)) {
        $("#pay-amount").parents('.form-group').addClass('has-error');
        $("#pay-amount").focus();
        pay_amount = false;
    }
    if (household_size && pay_rate && pay_amount){
        // update user feedback text
        $("#household-size-feedback").html(household_size + " people")
        return true
    }
    return false
}


function update_output() {

    // read input
    var household_size = $("#household-size").val();
    var pay_rate = $("#pay-rate").val();
    var pay_amount = $("#pay-amount").val();

    if (validate_input(household_size, pay_rate, pay_amount)) {
        var monthly_expenditure = calculate_expenditure(household_size);

        // calculate monthly pay
        var monthly_pay = 0;
        // Assumption using DoL info - a month includes 4.33 weeks and a week is for 5 work days.
        if (pay_rate == "day")
            monthly_pay = pay_amount * constants.workdays_per_month;
        else if (pay_rate == "week")
            monthly_pay = pay_amount * constants.weeks_per_month;
        else if (pay_rate == "month")
            monthly_pay = pay_amount;

        var output_percentage = (monthly_pay / monthly_expenditure);
        output_percentage *= 100;
        output_percentage = Math.round(output_percentage);

        var output_statement = "Try out the fair wage tool and see how your pay reflects living costs in South Africa.";
        if ((output_percentage >= 0) && (output_percentage < constants.output_low)) {
            output_statement = "You're paying too little given the living costs and the size of your domestic worker's household. Take time to reassess how much you're paying by using our tool.";
            highlight_output('label-danger');
        } else if ((output_percentage >= 75) && (output_percentage < constants.output_almost)) {
            output_statement = "You're nearly there! Take time to reassess the wage by using our tool or discussing costs with your domestic worker.";
            highlight_output('label-warning');
        } else if ((output_percentage >= constants.output_almost) && (output_percentage < 100)) {
            output_statement = "You're very close to paying a fair wage given the living costs and the size of your domestic worker's household. Share your results!";
            highlight_output('label-warning');
        } else {
            output_statement = "You're covering your domestic worker's Minimal Need. Share your results!";
            highlight_output('label-success');
        }

        // show results to the user
        $("#output-amount").html(to_rands(monthly_pay))
        $("#output-monthly-need").html(to_rands(monthly_expenditure))

        $("#output-percentage").html(output_percentage + "%")
        $("#output-statement").html(output_statement);
        return true
    }
    return false
}


function applySliderConfig(config) {
    $.each(config, function(id, cfg) {
        var $el = $('#' + id);
        if (!$el.length) return;

        $el.attr('data-slider-min', cfg.min)
           .attr('data-slider-max', cfg.max)
           .attr('data-slider-step', cfg.step)
           .attr('data-slider-value', cfg.value)
           .val(cfg.value);

        if (cfg.formater) $el.attr('data-slider-formater', cfg.formater);

        // Only update notes/source for entries that define them
        if (cfg.notes || cfg.source) {
            var $panel = $el.closest('.panel-body');
            $panel.find('.note, .sources').remove();

            if (cfg.notes) {
                cfg.notes.forEach(function(note) {
                    $panel.append('<p class="note">' + note + '</p>');
                });
            }
            if (cfg.source) {
                $panel.append('<p class="sources"><strong>Source:</strong> ' + cfg.source + '</p>');
            }
        }
    });
}

function initSliders() {
    function rand_formater(value) {
        return value + ' rand';
    }

    function child_formater(value) {
        if (value == 1)
            return '1 child';
        else
            return value + ' children';
    }

    function people_formater(value) {
        if (value == 1)
            return '1 person';
        else
            return value + ' people';
    }

    $(document).find(".slider").each(function(i) {
        var tmp_formater = rand_formater;
        if ($(this).attr("data-slider-formater") == "children")
            tmp_formater = child_formater;
        else if ($(this).attr("data-slider-formater") == "people")
            tmp_formater = people_formater;

        $(this).slider({ tooltip: 'always', formater: tmp_formater })
            .on('slideStop', function(event) {
                $(this).attr("data-slider-val", $(this).val())
                update_output()
            });
    });
}

$(document).ready(function() {

    // function for scrolling around website (links to "#section" will scroll to that section)
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top-15
        }, 900, 'swing');
    });

    $("#pay-amount").focus();

    // initialize dropdown selects
    $("#pay-rate").selectpicker().on("change", function() {
        update_output();
    })
    $("#pay-amount").on("change", function() {
        update_output();
    })
    $('#assumption-container .selectpicker').selectpicker().on("change",function() {
        update_output();
    });

    // update on click
    $("#go-button").on('click', function(e) {
        e.preventDefault();
        if (update_output())
        {
            update_display('display-results');
        }
    })

    $("#show-assumptions-btn").on('click', function() {
        update_display('display-assumptions');
    })

    // Load config from JSON, then initialise sliders and calculate
    $.getJSON('data/living-wage.json', function(data) {
        $.extend(constants, data.constants);
        applySliderConfig(data.sliders);
    }).always(function() {
        initSliders();
        update_output();
    });
});

