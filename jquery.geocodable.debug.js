/*
 Google Geocoder plugin for jQuery
 Version: 1.0

 Copyright (c) 2009 Andrew Houghton (aah@roarmouse.org)
 Copyright (c) 2009 VolunteerMatch

 October 15, 2009

 Tested with: jQuery 1.3.2+
 Depends on Google Maps libary being pre-loaded.

 Lots of comments in this file.  It's strongly recommended
 that you use the minified version.

 ------------------------------------------------------*/

;
(function ($) {
  var
    /**
     * jquery.data() Flag used to determine if a form has been seen before;
     * determines whether we hook up event listeners for submit.
     */
    gcFlag = "gcFlag",
    /**
     * jquery.data() holds input fields that need geocoding for a form
     */
    gcFields = "gcFields",
    /**
     * jquery.data() counts successful geocodings on submit
     */
    gcSuccess = "gcSuccess",
    /**
     * jquery.data() Flag marks whether we've started geocoding for a
     * form submit
     */
    gcStarted = "gcStarted",
    /**
     * Geocoder global
     */
    geocoder = null,
    /**
     * Map of 2-letter country code to English language name.
     */
    countryMap = {
      'AD': 'Andorra',
      'AE': 'United Arab Emirates',
      'AF': 'Afghanistan',
      'AG': 'Antigua and Barbuda',
      'AI': 'Anguilla',
      'AL': 'Albania',
      'AM': 'Armenia',
      'AN': 'Netherlands Antilles',
      'AO': 'Angola',
      'AQ': 'Antarctica',
      'AR': 'Argentina',
      'AS': 'American Samoa',
      'AT': 'Austria',
      'AU': 'Australia',
      'AW': 'Aruba',
      'AX': '﻿Åland Islands',
      'AZ': 'Azerbaijan',
      'BA': 'Bosnia and Herzegovina',
      'BB': 'Barbados',
      'BD': 'Bangladesh',
      'BE': 'Belgium',
      'BF': 'Burkina Faso',
      'BG': 'Bulgaria',
      'BH': 'Bahrain',
      'BI': 'Burundi',
      'BJ': 'Benin',
      'BL': 'Saint Barthélemy',
      'BM': 'Bermuda',
      'BN': 'Brunei',
      'BO': 'Bolivia',
      'BR': 'Brazil',
      'BS': 'Bahamas',
      'BT': "Bhutan",
      'BV': 'Bouvet Island',
      'BW': 'Botswana',
      'BY': 'Belarus',
      'BZ': 'Belize',
      'CA': 'Canada',
      'CC': 'Cocos Islands',
      'CD': 'Democratic Republic of the Congo',
      'CF': 'Central African Republic',
      'CG': 'Congo',
      'CH': 'Switzerland',
      'CI': '﻿Côte d\'Ivoire',
      'CK': 'Cook Islands',
      'CL': 'Chile',
      'CM': 'Cameroon',
      'CN': 'China',
      'CO': 'Colombia',
      'CR': 'Costa Rica',
      'CU': 'Cuba',
      'CV': 'Cape Verde',
      'CX': 'Christmas Island',
      'CY': 'Cyprus',
      'CZ': 'Czech Republic',
      'DE': 'Germany',
      'DJ': 'Djibouti',
      'DK': 'Denmark',
      'DM': 'Dominica',
      'DO': 'Dominican Republic',
      'DZ': 'Algeria',
      'EC': 'Ecuador',
      'EE': 'Estonia',
      'EG': 'Egypt',
      'EH': 'Western Sahara',
      'ER': 'Eritrea',
      'ES': 'Spain',
      'ET': 'Ethiopia',
      'FI': 'Finland',
      'FJ': 'Fiji',
      'FK': 'Falkland Islands',
      'FM': 'Federated States of Micronesia',
      'FO': 'Faroe Islands',
      'FR': 'France',
      'GA': 'Gabon',
      'GB': 'United Kingdom',
      'GD': 'Grenada',
      'GE': 'Georgia',
      'GF': 'French Guiana',
      'GG': 'Guernsey',
      'GH': 'Ghana',
      'GI': 'Gibraltar',
      'GL': 'Greenland',
      'GM': 'Gambia',
      'GN': 'Guinea',
      'GP': 'Guadeloupe',
      'GQ': 'Equatorial Guinea',
      'GR': 'Greece',
      'GS': 'South Georgia and the South Sandwich Islands',
      'GT': 'Guatemala',
      'GU': 'Guam',
      'GW': 'Guinea-Bissau',
      'GY': 'Guyana',
      'HK': 'Hong Kong',
      'HM': 'Heard Island and McDonald Islands',
      'HN': 'Honduras',
      'HR': 'Croatia',
      'HT': 'Haiti',
      'HU': 'Hungary',
      'ID': 'Indonesia',
      'IE': 'Ireland',
      'IL': 'Israel',
      'IM': 'Isle of Man',
      'IN': 'India',
      'IO': 'British Indian Ocean Territory',
      'IQ': 'Iraq',
      'IR': 'Iran',
      'IS': 'Iceland',
      'IT': 'Italy',
      'JE': 'Jersey',
      'JM': 'Jamaica',
      'JO': 'Jordan',
      'JP': 'Japan',
      'KE': 'Kenya',
      'KG': 'Kyrgyzstan',
      'KH': 'Cambodia',
      'KI': 'Kiribati',
      'KM': 'Comoros',
      'KN': 'Saint Kitts and Nevis',
      'KP': 'North Korea',
      'KR': 'South Korea',
      'KW': 'Kuwait',
      'KY': 'Cayman Islands',
      'KZ': 'Kazakhstan',
      'LA': 'Laos',
      'LB': 'Lebanon',
      'LC': 'Saint Lucia',
      'LI': 'Liechtenstein',
      'LK': 'Sri Lanka',
      'LR': 'Liberia',
      'LS': 'Lesotho',
      'LT': 'Lithuania',
      'LU': 'Luxembourg',
      'LV': 'Latvia',
      'LY': 'Libya',
      'MA': 'Morocco',
      'MC': 'Monaco',
      'MD': 'Moldova',
      'ME': 'Montenegro',
      'MF': 'Saint Martin',
      'MG': 'Madagascar',
      'MH': 'Marshall Islands',
      'MK': 'Macedonia',
      'ML': 'Mali',
      'MM': 'Myanmar',
      'MN': 'Mongolia',
      'MO': 'Macao',
      'MP': 'Northern Mariana Islands',
      'MQ': 'Martinique',
      'MR': 'Mauritania',
      'MS': 'Montserrat',
      'MT': 'Malta',
      'MU': 'Mauritius',
      'MV': 'Maldives',
      'MW': 'Malawi',
      'MX': 'Mexico',
      'MY': 'Malaysia',
      'MZ': 'Mozambique',
      'NA': 'Namibia',
      'NC': 'New Caledonia',
      'NE': 'Niger',
      'NF': 'Norfolk Island',
      'NG': 'Nigeria',
      'NI': 'Nicaragua',
      'NL': 'Netherlands',
      'NO': 'Norway',
      'NP': 'Nepal',
      'NR': 'Nauru',
      'NU': 'Niue',
      'NZ': 'New Zealand',
      'OM': 'Oman',
      'PA': 'Panama',
      'PE': 'Peru',
      'PF': 'French Polynesia',
      'PG': 'Papua New Guinea',
      'PH': 'Philippines',
      'PK': 'Pakistan',
      'PL': 'Poland',
      'PM': 'Saint Pierre and Miquelon',
      'PN': 'Pitcairn',
      'PR': 'Puerto Rico',
      'PS': 'Palestinian Territory',
      'PT': 'Portugal',
      'PW': 'Palau',
      'PY': 'Paraguay',
      'QA': 'Qatar',
      'RE': 'Réunion',
      'RO': 'Romania',
      'RS': 'Serbia',
      'RU': 'Russian Federation',
      'RW': 'Rwanda',
      'SA': 'Saudi Arabia',
      'SB': 'Solomon Islands',
      'SC': 'Seychelles',
      'SD': 'Sudan',
      'SE': 'Sweden',
      'SG': 'Singapore',
      'SH': 'Saint Helena',
      'SI': 'Slovenia',
      'SJ': 'Svalbard and Jan Mayen',
      'SK': 'Slovakia',
      'SL': 'Sierra Leone',
      'SM': 'San Marino',
      'SN': 'Senegal',
      'SO': 'Somalia',
      'SR': 'Suriname',
      'ST': 'Sao Tome and Principe',
      'SV': 'El Salvador',
      'SY': 'Syrian Arab Republic',
      'SZ': 'Swaziland',
      'TC': 'Turks and Caicos Islands',
      'TD': 'Chad',
      'TF': 'French Southern Territories',
      'TG': 'Togo',
      'TH': 'Thailand',
      'TJ': 'Tajikistan',
      'TK': 'Tokelau',
      'TL': 'Timor-Leste',
      'TM': 'Turkmenistan',
      'TN': 'Tunisia',
      'TO': 'Tonga',
      'TR': 'Turkey',
      'TT': 'Trinidad and Tobago',
      'TV': 'Tuvalu',
      'TW': 'Taiwan',
      'TZ': 'Tanzania',
      'UA': 'Ukraine',
      'UG': 'Uganda',
      'UM': 'United States Minor Outlying Islands',
      'US': 'United States',
      'UY': 'Uruguay',
      'UZ': 'Uzbekistan',
      'VA': 'Holy See',
      'VC': 'Saint Vincent and the Grenadines',
      'VE': 'Venezuela',
      'VG': 'British Virgin Islands',
      'VI': 'U.S. Virgin Islands',
      'VN': 'Vietnam',
      'VU': 'Vanuatu',
      'WF': 'Wallis and Futuna',
      'WS': 'Samoa',
      'YE': 'Yemen',
      'YT': 'Mayotte',
      'ZA': 'South Africa',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe'
    },
    /**
     * Map of 2-letter country code to Map of region abbreviation to name.
     * Could be used to
     */
    regionMap = {
      'US': {
        'AL': 'Alabama',
        'AK': 'Alaska',
        'AS': 'American Samoa',
        'AZ': 'Arizona',
        'AR': 'Arkansas',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DE': 'Delaware',
        'DC': 'District of Columbia',
        'FM': 'Federated States of Micronesia',
        'FL': 'Florida',
        'GA': 'Georgia',
        'GU': 'Guam',
        'HI': 'Hawaii',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'IA': 'Iowa',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'ME': 'Maine',
        'MH': 'Marshall Islands',
        'MD': 'Maryland',
        'MA': 'Massachusetts',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MS': 'Mississippi',
        'MO': 'Missouri',
        'MT': 'Montana',
        'NE': 'Nebraska',
        'NV': 'Nevada',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NY': 'New York',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'MP': 'Northern Mariana Islands',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PW': 'Palau',
        'PA': 'Pennsylvania',
        'PR': 'Puerto Rico',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VT': 'Vermont',
        'VI': 'Virgin Islands',
        'VA': 'Virginia',
        'WA': 'Washington',
        'WV': 'West Virginia',
        'WI': 'Wisconsin',
        'WY': 'Wyoming'
      }
    };

  /**
   * Private. Normalized placemark.  Depends on options for deciding
   * whether to use country / region mapping when building normalized
   * address.
   *
   * @param placemark Google Placemark
   * @param _options options
   */
  function Mark(placemark, _options) {
    this.latitude = 0.0;
    this.longitude = 0.0;
    this.accuracy = 0;
    this.country = null;
    this.region = null;
    this.city = null;
    this.postalCode = null;
    this.street = null;
    this.address = null;
    this.placemark = placemark;
    
    if (placemark.Point && placemark.Point.coordinates) {
      this.latitude = placemark.Point.coordinates[0];
      this.longitude = placemark.Point.coordinates[1];
    }

    var elem = placemark.AddressDetails;

    if (elem) {
      this.accuracy = elem.Accuracy;

      if (elem.Country != null) {
        elem = elem.Country;
        this.country = elem.CountryNameCode;
      }

      if (elem.AdministrativeArea != null) {
        elem = elem.AdministrativeArea;
        this.region = elem.AdministrativeAreaName;
      }

      if (elem.SubAdministrativeArea != null) {
        elem = elem.SubAdministrativeArea;
      }

      if (elem.Locality != null) {
        elem = elem.Locality;
        this.city = elem.LocalityName;
      }

      if (elem.PostalCode != null) {
        this.postalCode = elem.PostalCode.PostalCodeNumber;
      }

      if (elem.Thoroughfare != null) {
        this.street = elem.Thoroughfare.ThoroughfareName;
      }

      this.buildAddress(_options);
    }
  }

  /**
   * Private. Build the address for a Mark; separated out because I'm
   * not sure yet whether to pre-build the address in every case,
   * and there may be a better way to handle the _options, which
   * are being passed all over the hell and gone.
   *
   * @param _options options
   */
  Mark.prototype.buildAddress = function(_options) {
    var address = this.address, region, country;

    if (address == null) {
      if (this.street != null) {
        address = this.street;
      }

      if (this.city != null) {
        address = address == null ? this.city : address + ', ' + this.city;
      }

      if (this.region != null) {
        region = this.region;

        if (address == null || this.street == null) {
          // use the full name, if available
          if (_options && _options.mapRegion && regionMap[this.country] && regionMap[this.country][this.region]) {
            region = regionMap[this.country][this.region];
          }
        }

        address = address == null ? region : address + ', ' + region;
      }

      if (this.postalCode != null) {
        address = address == null ? this.postalCode : address + ', ' + this.postalCode;
      }

      if (this.country != null) {
        country = this.country;

        if (_options && _options.mapCountry && countryMap[this.country]) {
          country = countryMap[this.country];
        }

        if (address != null) {
          if (_options && $.inArray(this.country, _options.implicitCountries) == -1) {
            address = address + ', ' + country;
          }
        } else {
          address = country;
        }
      }

      this.address = address;
    }

    return address;
  };

  /**
   * Private. Is this Mark valid for use?  Minimally, a Mark must have an
   * address we can display, and the country for the Mark must not be in
   * the set of countries we're willing to display.
   *
   * @param _options options
   */
  Mark.prototype.isValid = function(_options) {
    var response = true;

    if (this.address == null) {
      response = false;
      console.log(this.placemark);
    }

    if (response && this.country && _options.countries.length > 0) {
      response = $.inArray(this.country.toUpperCase(), _options.countries) != -1;
    }

    return response;
  };

  /**
   * Private. Alphabetic comparator, sorts Marks by country then address.
   *
   * @param that the other Mark
   */
  Mark.prototype.compareTo = function(that) {
    if (this.country != that.country) {
      return this.country < that.country ? -1 : 1;
    }

    return this.address < that.address ? -1 : this.address == that.address ? 0 : 1;
  };

  /**
   * Private. Hook up geocoding for a form/field.  If the form hasn't been
   * seen before, add the necessary jquery.data() calls.  Push the field onto
   * the form's gcFields.  Iff we've seen the form before, return true.
   *
   * @param fld guaranteed to be a text input field
   */
  var _addGeocodableInput = function(fld) {
    var $form = $(fld.form), flds = $form.data(gcFields), formWasKnown = flds != null;

    if (!flds) {
      flds = new Array();
      $form.data(gcFields, flds);
      $form.data(gcStarted, 0);
      $form.data(gcSuccess, new Array());
    }

    flds.push(fld);

    return formWasKnown;
  };

  /**
   * Public / Overrideable. Internal sample of a disambiguation callback.
   * Displays a popup below the field in question, populates it with the
   * valid Marks, and allows the user to click one to populate the
   * original field. Depends on two styles: "disambiguation" (for the
   * popup), and "disambiguationLink" (for the individual options).  More
   * to be done here -- allow using the keyboard to navigate options.
   *
   * @param fld the text field with the ambiguous address
   * @param marks the set of possible Marks
   * @param $form the parent form of the field, if any -- this
   * will always be set for submit, never be set for blur
   * @param _options options
   */
  var _disambiguate = function(fld, marks, $form, _options) {
    var _removeDisambiguation = function(evt) {
      if (!$(evt.target).hasClass('disambiguation')) {
        $(document).unbind('keypress', _removeDisambiguation);
        $(document).unbind('mousedown', _removeDisambiguation);
        $('.disambiguation').remove();
      }
    };

    var d = $(document.createElement('div')),
      pos = $(fld).position();

    $.each(marks, function() {
      var sd = document.createElement('div');
      sd.mark = this;
      $(sd).text(this.address).addClass('disambiguationLink');
      d.append(sd);
    });

    d.addClass('disambiguation');
    d.css({
      "left": pos.left,
      "top": pos.top + $(fld).outerHeight(),
      "width": $(fld).width()
    });
    $(fld).after(d);

    $('.disambiguationLink').live('click', function() {
      $(fld).val($(this).text());
      if (_options.choiceCallback) {
        _options.choiceCallback(this.mark);
      }
      d.remove();
      if ($form) {
        $form.submit();
      }
    });

    $(document)
      .bind('keypress', _removeDisambiguation)
      .bind('click', _removeDisambiguation);
    d.show();
  };

  /**
   * Private. A helper function to reset the form success status
   * and preset the started flag (only used for submit)
   *
   * @param frm a form
   * @param flag true if we've started geocoding
   */
  var _resetStatus = function(frm, flag) {
    $(frm)
      .data(gcStarted, flag)
      .data(gcSuccess, new Array());
  };

  /**
   * Private. Geocode an individual field.
   *
   * @param elt a text input field
   * @param _options options
   * @param $form if we're submitting a form, the parent form of the field
   */
  var _geocodeThis = function(elt, _options, $form) {
    var loc = $.trim($(elt).val());

    if (loc.length > 1) {
      if (_options.baseCountryCode != null) {
        geocoder.setBaseCountryCode(_options.baseCountryCode);
      }
      geocoder.getLocations(loc, _getGeocoderCallback(elt, _options, $form));
    } else if ($form) {
      _pushResult($form, 1);
      $form.submit();
    }
  };

  /**
   * Private. Geocode a form or field.
   *
   * @param elt a form or a text input field
   * @param _options options
   */
  var _geocode = function(elt, _options) {
    if ($(elt).is('form')) {
      _resetStatus(elt, 1);

      $.each($(elt).data(gcFields), function() {
        _geocodeThis(this, _options, elt);
      });
    } else {
      _geocodeThis(elt, _options);
    }
  };

  /**
   * Private. Helper function to provide a closure for the AJAX callback.
   *
   * @param fld the field being geocoded
   * @param _options options
   * @param $form the field's parent form, if we're submitting
   */
  var _getGeocoderCallback = function(fld, _options, $form) {
    return function(response) {
      return _geocoderCallback(fld, _options, $form, response);
    };
  };

  /**
   * Private. Build marks, normalize, sort, return.
   *
   * @param placemarks the Placemarks from Google
   * @param _options options
   */
  var _buildMarkArray = function(placemarks, _options) {
    var marks = new Array(), addresses = new Array();
    $.each(placemarks, function() {
      if (this && this.AddressDetails) {
        var mark = new Mark(this, _options);
        if (mark.isValid(_options)) {
          if ($.inArray(mark.address, addresses) == -1) {
            marks.push(mark);
            addresses.push(mark.address);
          }
        }
      }
    });

    marks.sort(function(mark1, mark2) {
      return mark1.compareTo(mark2);
    });

    return marks;
  };

  /**
   * Private.  The callback for the geocodeLocations call.
   *
   * @param fld the field being geocoded
   * @param _options options
   * @param $form the parent form, if we're submitting
   * @param response the response from Google for the AJAX call
   */
  var _geocoderCallback = function(fld, _options, $form, response) {
    var code = !response ? -1 : response.Status.code;

    if (code == 500 || code == 603 || code == 620) {
      // failure that could be browser related; pass off to server
      if ($form) {
        _pushResult($form, 1);
      }
    } else if (code == -1 || code != 200) {
      // no result, or any other error
      if ($form) {
        _pushResult($form, _options.submitOnFailure ? 1 : 0);
      }
    } else {
      var marks = _buildMarkArray(response.Placemark, _options);
      if (marks.length < 1) {
        if ($form) {
          _pushResult($form, _options.submitOnFailure ? 1 : 0);
        }
      } else if (marks.length == 1) {
        if ($form) {
          _pushResult($form, 1);
        }
        $(fld).val(marks[0].address);
        if (_options.choiceCallback) {
          _options.choiceCallback(marks[0]);
        }
      } else {
        if ($form) {
          _pushResult($form, 0);
        }
        _options.disambiguationCallback(fld, marks, $form, _options);
      }
    }

    if ($form) {
      $form.submit();
    }
  };

  /**
   * Private.  Helper function to track success or not for individual
   * fields in a form.
   *
   * @param $form the form we're geocoding
   * @param success true if geocoding resulted in one, unambiguous answer
   */
  var _pushResult = function($form, success) {
    $form.data(gcSuccess).push(success);
  };

  /**
   * Private. Helper function to calculate whether all the fields on
   * a form are done geocoding.
   *
   * @param frm the form we're geocoding
   */
  var _isComplete = function(frm) {
    return ($(frm).data(gcSuccess).length == $(frm).data(gcFields).length);
  };

  /**
   * Private.  Helper function to calculate whether all the fields
   * for the given form were succesfully geocoded.
   *
   * @param frm the form we're geocoding
   */
  var _isSuccess = function(frm) {
    var results = $(frm).data(gcSuccess), success = 0;

    $.each(results, function() {
      success = success + this;
    });

    return success == results.length;
  };

  /**
   * Private.  Helper function to determine if we're
   * currently geocoding a form
   *
   * @param frm the form
   */
  var _isGeocoding = function(frm) {
    return $(frm).data(gcStarted) == 1;
  };

  /**
   * The plugin.  We ignore any incoming elements which are not text
   * input fields.  We provide the following options:
   * <ul>
   * <li>disambiguationCallback: a callback used to display a set of
   * potential address matches.  See <code>_disambiguate</code> for an
   * example.
   * <li>choiceCallback: a callback used for notification when a user
   * chooses a particular option from the disambiguation popup. No
   * internal examples.
   * <li>onSubmit: should we trigger when our form is submitted?
   * <li>onBlur: should we trigger on field.blur?
   * <li>submitOnFailure: should we allow form submit if the fields
   * couldn't be geocoded?
   * <li>countries: an array of 2-letter country abbreviations that we
   * accepts as geocoding results.  If the results come from different
   * countries, we won't display them.  Set to an empty array to allow
   * all countries.
   * <li>implicitCountries:  an array of 2-letter country abbreviations
   * that we don't bother adding to addresses -- they're "local".
   * <li>baseCountryCode: an override for the browser country code; if
   * set, we pass it to Google for every geocoding call.  Note that this
   * is a ccTLD, <em>NOT</em> a country abbreviation.  See
   * http://code.google.com/apis/maps/documentation/reference.html#GClientGeocoder
   * for more information.
   * <li>mapCountry: should we attempt to map country codes to country names?  Note
   * that this is not localized.
   * <li>mapRegion: should we attempt to map region abbreviations to region names?
   * Note that this is not localized.
   * </ul>
   *
   * @param options
   */
  $.fn.geocodable = function (options) {
    var _options = jQuery.extend({
      disambiguationCallback: _disambiguate,
      choiceCallback: null,
      onSubmit: true,
      onBlur: true,
      submitOnFailure: true,
      countries: ['US', 'PR', 'GU', 'VI', 'MP'],
      implicitCountries: ['US'],
      baseCountryCode: null,
      mapCountry: true,
      mapRegion: true
    }, options);

    if (geocoder == null && typeof(GBrowserIsCompatible) != "undefined" && GBrowserIsCompatible()) {
      geocoder = new GClientGeocoder();
    }

    return this.each(
      function () {
        var $input = $(this), $form = $(this.form);

        if (geocoder == null || !$input.is(':text')) {
          return;
        }

        if (!$input.data(gcFlag)) {
          $input.data(gcFlag, 1);

          if (_options.onBlur) {
            $input.blur(function() {
              _geocode(this, _options);
            });
          }

          if (_options.onSubmit) {
            if (!_addGeocodableInput(this)) {
              $form.submit(function() {
                if (_isGeocoding(this)) {
                  if (!_isComplete(this)) return false;
                  if (_isSuccess(this)) {
                    this.submit();
                    return true;
                  } else {
                    _resetStatus(this, 0);
                    return false;
                  }
                }
  
                _geocode(this, _options);
                return false;
              });
            }
          }
        }
      });
  };
})(jQuery);
