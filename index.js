document.addEventListener('DOMContentLoaded', function() {
    // This is for mode switching
    const switchBtn = document.querySelector('.change_mode');

    if (switchBtn) {
        switchBtn.addEventListener('click', modeSwitch);
    }

    function modeSwitch() {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === "dark") {
            document.documentElement.setAttribute('data-theme', "light");
            switchBtn.innerHTML = "<i class='bx bxs-sun icon'></i> Light Mode";
        } else {
            document.documentElement.setAttribute('data-theme', "dark");
            switchBtn.innerHTML = "<i class='bx bxs-moon icon'></i> Dark Mode";
        }
    }
    
    // this is for region filtering display
    

    const filterBox = document.querySelector('.fliter_btn');
    
    filterBox.addEventListener('click', regionDisplay);

    let show_region_box = false;

    function regionDisplay() {
        const regionList = document.querySelector('.filter_region');
        show_region_box = !show_region_box;
        if (show_region_box) {
            regionList.style.display = "flex";
        }
        else {
            regionList.style.display = "none";
            const allcountries = document.querySelectorAll('.country');
            allcountries.forEach(country =>{
                country.style.display = 'block';
            });
        }
    }

    // this is for listing all the countries with basic info
    const ctyContainer = document.querySelector('.country_container');
    let countrydata = [];
    
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            countrydata = data;

            data.forEach(country => {
                const CountryDiv = document.createElement('div');
                CountryDiv.classList.add('country');
                CountryDiv.setAttribute('data-country', country.name.replace(/\s+/g, '-'));
                
                

                CountryDiv.innerHTML = `
                    <div class="cty_img">
                    <img src=${country.flags.png} alt="country_flag">
                    </div>
                    <div class="cty_info">
                        <span class="country_name">
                            ${country.name}
                        </span>
                        <ul class="country_basic_info">
                            <li><span class="basic_info">Population: </span>${country.population}</li>
                            <li><span class="basic_info">Region: </span>${country.region}</li>
                            <li><span class="basic_info">Capital: </span>${country.capital}</li>
                        </ul>
                    </div>
                `;
            ctyContainer.appendChild(CountryDiv);
        });

    });

    //adding a debounce function to prevent prequent request
    function debounce(func, wait) {
        let timeout;

        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    //achieving the searching function 
    const inputBox = document.querySelector('.searching_box');
    
    inputBox.addEventListener('input', debounce(function(event) {
        const searchcontent = event.target.value.trim().toLowerCase();
        // const searchResult = countrydata.find( country => country.name.trim().toLowerCase() === searchcontent);
        const allcountries = document.querySelectorAll('.country');
        
        allcountries.forEach(element => {
            const countryName = element.getAttribute('data-country').toLowerCase();

            if (countryName.includes(searchcontent)){
                element.style.display = 'block';
            }
            else {
                element.style.display = 'none';
            }
        });
    }, 300));

    //this is for filtering out the selected regions
    const regionBtn = document.querySelectorAll('.single_reg');

    regionBtn.forEach(button => {
        button.addEventListener('click', function() {
            
            const matchRegion = button.getAttribute('data-region-name');
            const fittedCountries = countrydata.filter(country => country.region === matchRegion);
            const allcountries = document.querySelectorAll('.country');
            
            // Hide all countries
            allcountries.forEach(element => {
                element.style.display = 'none';
            });
    
            // Show only the countries that match the selected region
            fittedCountries.forEach(country => {
                // Find the DOM element with the matching country name
                const countryElement = document.querySelector(`.country[data-country="${country.name}"]`);
                if (countryElement) {
                    countryElement.style.display = 'block';
                }
            });
        });
    });
    


    // this is for displaying the detail of the cuntries
    // const countryButtons = document.querySelectorAll('.country, .border-country-tag');
    // this is to catch the country button clicked in the info_page
    const main_page = document.querySelector('.primary_page');
    // const countryButtons = document.querySelectorAll('.country');

    main_page.addEventListener('click', function(event) {
        const clickButton = event.target.closest('.country');
        if (!clickButton) return;
    
        // collecting the infomation for your clicked button
    
        // getting the respective attribute
        const countryName = clickButton.getAttribute('data-country');
        const Countrystats = countrydata.find(country => country.name.replace(/\s+/g, '-') === countryName);
        if (!Countrystats) return;

        // -------------------------------------------
        // now showing the detail page
        const main_page = document.querySelector('.primary_page');
        const info_page = document.querySelector('.infomation');

        // // remove the current country details, if existed
        // const removeInfo = document.querySelector('.one-detail');
        // if (removeInfo) {
        //     info_page.removeChild(removeInfo);
        // }
        
        main_page.style.display = "none";
        info_page.style.display = "flex";

        const CountryInfo = document.createElement('section');
        CountryInfo.classList.add('one-detail');

        CountryInfo.innerHTML = `
            <div class="one-flag">
                <img src="${Countrystats.flags.png}" alt="${countryName}-flag">
            </div>
            <div class="one-info">
                <span class="one-name">${Countrystats.name}</span>
                <div class="stats">
                    <ul class="one-all-stats">
                        <li><span>Native Name: </span>${Countrystats.nativeName}</li>
                        <li><span>Population: </span>${Countrystats.population}</li>
                        <li><span>Region: </span>${Countrystats.region}</li>
                        <li><span>Sub Region: </span>${Countrystats.subregion}</li>
                        <li><span>Capital: </span>${Countrystats.capital}</li>
                        <li><span>Top Level Domain: </span>${Countrystats.topLevelDomain.join(', ')}</li>
                        <li><span>Currencies: </span>${Countrystats.currencies.map(currency => currency.name).join(', ')}</li>
                        <li><span>Languages: </span>${Countrystats.languages.map(language => language.name).join(', ')}</li>
                    </ul>
                </div>
            </div>
        `;
        info_page.appendChild(CountryInfo);

        // if the border info existed, add the border infomation
        const borderInfo = document.querySelector('.one-info');
        if (Countrystats.borders && Countrystats.borders.length > 0) {
            const borderCountries = Countrystats.borders.map(bordercode => {
                const borderCountry = countrydata.find(country => country.alpha3Code === bordercode);
                if (borderCountry){
                    return `<button class="border-country-tag" data-country=${borderCountry.name.replace(/\s+/g, '-')}>${borderCountry.name}</button>`;
                }
                return '';
            }).join('\n');
            
            const borderDiv = document.createElement('div');
            borderDiv.classList.add('border-country');

            borderDiv.innerHTML = `
                <p><span>Border Countries: </span></p>
                <div class="borderBtn">
                    ${borderCountries}
                </div>
            `;
            borderInfo.appendChild(borderDiv);
        }
    });

    // this is to catch the country button clicked in the primary page
    const info_page = document.querySelector('.infomation');
    // const countryButtons = document.querySelectorAll('.country');

    info_page.addEventListener('click', function(event) {
        const clickButton = event.target.closest('.border-country-tag');
        if (!clickButton) return;
    
        // collecting the infomation for your clicked button
    
        // getting the respective attribute
        const countryName = clickButton.getAttribute('data-country');
        const Countrystats = countrydata.find(country => country.name.replace(/\s+/g, '-') === countryName);
        if (!Countrystats) return;

        // -------------------------------------------
        // now showing the detail page
        const main_page = document.querySelector('.primary_page');
        const info_page = document.querySelector('.infomation');

        // remove the current country details, if existed
        const removeInfo = document.querySelector('.one-detail');
        if (removeInfo) {
            info_page.removeChild(removeInfo);
        }
        
        main_page.style.display = "none";
        info_page.style.display = "flex";

        const CountryInfo = document.createElement('section');
        CountryInfo.classList.add('one-detail');

        CountryInfo.innerHTML = `
            <div class="one-flag">
                <img src="${Countrystats.flags.png}" alt="${countryName}-flag">
            </div>
            <div class="one-info">
                <span class="one-name">${Countrystats.name}</span>
                <div class="stats">
                    <ul class="one-all-stats">
                        <li><span>Native Name: </span>${Countrystats.nativeName}</li>
                        <li><span>Population: </span>${Countrystats.population}</li>
                        <li><span>Region: </span>${Countrystats.region}</li>
                        <li><span>Sub Region: </span>${Countrystats.subregion}</li>
                        <li><span>Capital: </span>${Countrystats.capital}</li>
                        <li><span>Top Level Domain: </span>${Countrystats.topLevelDomain.join(', ')}</li>
                        <li><span>Currencies: </span>${Countrystats.currencies.map(currency => currency.name).join(', ')}</li>
                        <li><span>Languages: </span>${Countrystats.languages.map(language => language.name).join(', ')}</li>
                    </ul>
                </div>
            </div>
        `;
        info_page.appendChild(CountryInfo);

        // if the border info existed, add the border infomation
        const borderInfo = document.querySelector('.one-info');
        if (Countrystats.borders && Countrystats.borders.length > 0) {
            const borderCountries = Countrystats.borders.map(bordercode => {
                const borderCountry = countrydata.find(country => country.alpha3Code === bordercode);
                if (borderCountry){
                    return `<button class="border-country-tag" data-country=${borderCountry.name.replace(/\s+/g, '-')}>${borderCountry.name}</button>`;
                }
                return '';
            }).join('\n');
            
            const borderDiv = document.createElement('div');
            borderDiv.classList.add("border-country");

            borderDiv.innerHTML = `
                <p><span>Border Countries: </span></p>
                <div class="borderBtn">
                    ${borderCountries}
                </div>
            `;
            borderInfo.appendChild(borderDiv);
        }
    });

    // if back button is clicked ...
    const goback = document.querySelector('.back');
    goback.addEventListener('click', info_hide);

    function info_hide() {
        const main_page = document.querySelector('.primary_page');
        const info_page = document.querySelector('.infomation');

        const removeInfo = document.querySelector('.one-detail');
        if (removeInfo) {
            info_page.removeChild(removeInfo);
        }

        main_page.style.display = "block";
        info_page.style.display = "none";
    }

    

});