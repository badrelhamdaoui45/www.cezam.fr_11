function cataloguSearchSelectTheme(id){
    $('#searchFormTheme').val(id);
    $('#searchFormSubTheme').val('');
    //Get theme label
    var label = $('.filter-theme [rel="theme-'+ id +'"]').html();
    if(label){
        $('.filter-theme a.link-addon .filter-label').html(label);
    }
    $('.filter-theme .catalog-search-form-filters-content').hide();
}
function cataloguSearchSelectSubTheme(themes){
    var subThemes = themes.split(',');
    for(index_theme in subThemes){
        $('#subThemeFilter'+ subThemes[index_theme]).prop('checked', true);
    }
    handleFacetChange('themes', 'add');
    $('#searchFormSubTheme').val(themes);
}
function cataloguSearchSelectRegions(ids) {
    var regions = ids.split(',');
    for(var region in regions) {
        debugger;
        $('#regionFilter'+ regions[region]).prop('checked', true);
    }
    $('#searchFormRegion').val(ids);
}
function cataloguSearchSelectRegion(id){
    if(id.startsWith('r')) {
        id = id.substring(1);
    }
    $('#searchFormRegion').val(id);
    $('#searchFormDepartement').val('');
    //Get localisation label
    var label = $('.filter-localisation [rel="localisation-r'+ id +'"]').html();
    if(label){
        $('.filter-localisation a.link-addon .filter-label').html(label);
    }
    handleFacetChange('address:region_id', 'add');
    $('.filter-localisation .catalog-search-form-filters-content').hide();
}
function cataloguSearchSelectDepartment(id){
    $('#searchFormDepartement').val(id);
    $('#searchFormRegion').val('');
    //Get localisation label
    var label = $('.filter-localisation [rel="localisation-'+ id +'"]').html();
    if(label){
        $('.filter-localisation a.link-addon .filter-label').html(label);
    }
    handleFacetChange('address:department_id', 'add');
    $('.filter-localisation .catalog-search-form-filters-content').hide();
}
function cataloguSearchSelectCriteria(criterias){
    var criteriaValues = criterias.split(',');
    for(index_criteria in criteriaValues){
        $('#subLocalisationFilter'+ criteriaValues[index_criteria]).prop('checked', true);
    }
    $('#searchFormCriteria').val(criterias);
}
function cataloguSearchSelectPeriod(startDate, endDate){
    $('#searchFormStartDate').val(startDate);
    $('#searchFormEndDate').val(endDate);
    $('.catalogSearchDaterange').data('daterangepicker').setStartDate(moment(startDate, 'DD-MM-YYYY'));
    $('.catalogSearchDaterange').data('daterangepicker').setEndDate(moment(endDate, 'DD-MM-YYYY'));
    var period = 'Période';
    if(startDate != endDate){
        period = $('.catalogSearchDaterange').data('daterangepicker').startDate.format('DD MMM') +' - '+ $('.catalogSearchDaterange').data('daterangepicker').endDate.format('DD MMM');
    }else{
        period = $('.catalogSearchDaterange').data('daterangepicker').startDate.format('DD MMM');
    }
    $('.catalogSearchDaterange').val(period);
    $('.filter-period .catalog-search-form-filters-content').hide();
}
function submitSearch(){
    $('#catalogSearchForm').submit();
}
function displayWarning(target, message){
    $(target +' .catalog-warning').remove();
    $(target).prepend('<div class="alert alert-info text-center catalog-warning">'+ message +'</div>');
}
function isMobile(){
    return $( window ).width()<=580;
}

function handleFacetChange(field, type) {
    const input = document.getElementById('facets_order');
    if(!input) {
        console.debug('No facet input found');
        return;
    }
    let facetsOrder = input.value.split(',');
    switch(type) {
        case 'add':
            if(!facetsOrder.includes(field)) {
                facetsOrder.push(field);
            }
            break;
        case 'remove':
            if (facetsOrder.includes(field)) {
                facetsOrder.splice(facetsOrder.indexOf(field), 1);
            }
            break;
        default:
            throw new Error('Unknown facet action '+type);
    }
    facetsOrder = facetsOrder.filter(v => v && v.length>0);
    input.value = facetsOrder.join(',');
}

$(document).ready(function() {
    $('.select_seance').change(function(){
        $(this).parent().submit();
        //window.location=location.origin + location.pathname + '?id_produit=';
    });
    $('.catalog-quantite-btn').click(function(){
        var target = $(this).data('target');
        var value =  $(this).data('value');
        if(target) {
            var quantite = parseInt($(target).val());
            if (isNaN(quantite)){
                quantite = 0;
            }
            if(value == '-' && quantite >= 1) {
                $(target).val(quantite - 1);
            }else if(value == '+'){
                $(target).val(quantite + 1);
            }
        }
        return false;
    });

    $('.select-list > li').click(function(e){
        var parent = $(this).parent();
        $(parent).find('li').removeClass('selected');
        $(parent).find('.select-list-sub').hide();
        $(this).addClass('selected');
        $(this).find('.select-list-sub').show();
        if ($(this).find('.select-list-sub li').length == 1) {
            $(this).find('.select-list-sub li:first-child').trigger('click');
        }
    });
    $('.select-list-sub > li').click(function(event){
        $(this).parent().find('li').removeClass('selected');
        $(this).addClass('selected');
        $('#delivery_mode_shipment_'+$(this).data('shipment-id')).val($(this).data('price-id'))
        event.stopPropagation();
    });
    $('.select-list').each(function(){
        if ($(this).find('>li').length == 1) {
            $(this).find('>li:first-child').trigger('click');
        }
    });

    $('#selectDeliveryAddress a').click(function(){
        var index = $(this).data('index');
        $('#form_address').val(index);
        $('#selectDeliveryAddress a').removeClass('active');
        $(this).addClass('active');
        return false;
    });

    $('.contextual-menu-toggle').click(function(){
        $('.contextual-menu .contextual-menu-content').show();
        $('.contextual-menu .contextual-menu-close').show();
        $(this).hide();
        return false;
    });
    $('.contextual-menu-close').click(function(){
        $('.contextual-menu .contextual-menu-content').hide();
        $('.contextual-menu .contextual-menu-toggle').show();
        $(this).hide();
        return false;
    });

    $('#cgv').click(function(){
        $('#summaryPayOrderButton').attr('disabled', !$(this).prop('checked'));
    });

    const fieldFilters = [
        {field: 'id_theme', filterContainerId: 'filter-theme', relPrefix: 'theme-'},
        {field: 'id_region', filterContainerId: 'filter-localisation', relPrefix: 'localisation-r'},
        {field: 'id_departement', filterContainerId: 'filter-localisation', relPrefix: 'localisation-', labelAppend: true}
    ];
    for(const fieldFilter of fieldFilters) {
        const field = $('input[name="'+fieldFilter.field+'"]');
        if(!field || !field.val()) {
            continue;
        }
        const values = field.val().split(',');

        const filterContainer = $('#'+fieldFilter.filterContainerId);
        const labels = [];
        const labelElement = filterContainer.find('.filter-label');
        if(fieldFilter.labelAppend && labelElement.data('label-changed')) {
            labels.push(labelElement.text());
        }
        for(const value of values) {
            labels.push(filterContainer.find('[rel="'+fieldFilter.relPrefix+value+'"]').text());
        }

        labelElement
            .text(labels.join(', '))
            .data('label-changed', true)
        ;
    }
    const startField = $('[name=start_date]');
    const endField = $('[name=end_date]');
    if(startField && endField && startField.val() && endField.val()) {
        cataloguSearchSelectPeriod(startField.val(), endField.val());
    }

    const filters = [
        {selector: '.contextual-menu input.catalog-theme-filter', input: '#searchFormTheme', facetName: 'themes'},
        {selector: '.contextual-menu input.catalog-region-filter', input: '#searchFormRegion', facetName: 'address:region_id'},
        {selector: '.contextual-menu input.catalog-departement-filter', input: '#searchFormDepartement', facetName: 'address:department_id'},
        {selector: '.contextual-menu input.catalog-criteria-filter', input: '#searchFormCriteria', facetName: 'criteria'},
        {selector: '.filters-menu input.catalog-accessMode-filter', input: '#searchFormAccessMode', facetName: 'access_mode'}
    ];

    for(const filter of filters) {
        $(filter.selector).change(function(e){
            if($(this).is(':checked')) {
                handleFacetChange(filter.facetName, 'add');
            }

            var selectedValues = [];
            $(filter.selector+':checked').each(function(){
                selectedValues.push($(this).val());
            });
            $(filter.input).val(selectedValues.join(','));

            // Uncheck child items
            var evt = new jQuery.Event('change');
            evt.autoTrigger = true;
            $(this).closest('li').find('input:checked').not(this).prop('checked', false).trigger(evt);

            if(selectedValues.length === 0) {
                handleFacetChange(filter.facetName, 'remove');
            }
            if(!e.autoTrigger && !isMobile()) {
                submitSearch();
            }
        });
    }

    if (isMobile()) {
        $('.main-content .filters-menu').appendTo('.contextual-menu .contextual-menu-content');
    }

});
