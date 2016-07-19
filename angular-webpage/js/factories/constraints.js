/**
* Factory in charge of the uses media device (camera & 
* microphone)
* @class - constraints
*/
app.factory('constraints', ['$window', 'deviceDetector', 'upload', function($window, device, upload) {
    
    //Initialization of parameters according to users Settings
	var type = 'composite';
	var browser = device.browser;
	var chromeExtensionInstalled = false;
	var canPresent = (device.isDesktop() && (browser == 'chrome' || browser == 'firefox')) && ($window.location.protocol == 'https:');
	var compositeOptions = 'normal';
	var warning = null;

	// Configuration for the extension if it is Chrome
	if (browser == 'chrome') {
		$window.addEventListener('message', function(event) {
			if (event.origin != $window.location.origin) return;

			// content-script will send a 'SS_PING' msg if extension is installed
			if (event.data.type && (event.data.type === 'SS_PING'))
				chromeExtensionInstalled = true;
		});
	}
    
    //Minimal parameters for the webcam presentation
	var constraintWebcam = {
		audio: true,
		video: {
			width: { min: 160 },
			height: { min: 120 }
		}
	};

    //Default parameters for webcam presentation
	var defaultConstraintPresentation = {
		audio: false,
		video: {
			width: 320,
			height: 180
		}
	};

    
    //Specific chrome's parameters for webcam presentation
	var chromeConstraintPresentation = {
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				maxWidth: window.screen.width,
				maxHeight: window.screen.height
			}
		}
	};
    
    /**
    * @function get() - constraint configuraton getter
    * Specifies application behavior in every case
    * @return Object - constraints
    */
	function get() {

		var constraints, consMaxWidth, consMaxHeight;

		if (type != 'composite' && canPresent) {

			if (browser == 'chrome') {
				constraints = chromeConstraintPresentation;
			} else {
				constraints = defaultConstraintPresentation;
				constraints.video.mediaSource = type;
			}

		} else if (compositeOptions == 'watchOnly') {
			constraints = { audio: false, video: false };
		} else if (compositeOptions == 'audioOnly') {
			constraints =  { audio: true, video: false };
		} else {
			constraints = constraintWebcam;

			if (upload.speed() >= 0.5) {
				consMaxWidth = 320;
				consMaxHeight = 240;
			} else {
				consMaxWidth = 160;
				consMaxHeight = 120;
			}

			constraints.video.width.max = constraints.video.width.ideal = consMaxWidth;
			constraints.video.height.max = constraints.video.height.ideal = consMaxHeight;

		}

		return constraints;

	}
    
    /**
    * @function setCompositeOptions() - composite setters
    */
	function setCompositeOptions(opt) {
		if (opt && (opt == 'normal' || opt == 'audioOnly' || opt == 'watchOnly'))
			compositeOptions = opt;
	}
    
    /**
    * @function getType() - type getter
    * @return Object - type
    */
	function getType() {
		return type;
	}

    /**
    * @function setType() - type setter
    * @param Object - t
    */
	function setType(t) {
		type = t;
	}

    /**
    * @function seTiD() - ID setter
    * @param String - id
    */
	function setId(id) {
		chromeConstraintPresentation.video.mandatory.chromeMediaSourceId = id;
	}

    /**
    * @function chromeExtensionDetected() - Extension *confirmation
    * Change the state of extension installation to true
    */
	function chromeExtensionDetected() {
		chromeExtensionInstalled = true;
	}

    /**
    * @function ischromeExtensionInstalled() - Extension 
    * checker
    * @return Boolean - chromeExtensionInstalled
    */
	function isChromeExtensionInstalled() {
		return chromeExtensionInstalled;
	}
    
    /**
    * @function getWarning() - warning getter
    * @return String - warning
    */
	function getWarning() {
		return warning;
	}

    /**
    * @function setWarning() - warning setter
    * @param String - w
    */
	function setWarning(w) {
		warning = w;
	}

	return {
		browser: browser,
		browserIsChrome: (browser == 'chrome'),
		browserIsFirefox: (browser == 'firefox'),
		chromeExtensionDetected: chromeExtensionDetected,
		isChromeExtensionInstalled: isChromeExtensionInstalled,
		canPresent: canPresent,
		setId: setId,
		getType: getType,
		setType: setType,
		get: get,
		setCompositeOptions: setCompositeOptions,
		getWarning: getWarning,
		setWarning: setWarning
	};
}]);