var Lynx = Lynx || {};

Lynx.LogLevel= {
	DEV: 6,
	INTERNAL: 5,
	INFO: 4,
	DEBUG: 3,
	WARNING: 2,
	ERROR: 1,
	FATAL_ERROR: 0,
	Parse: function(pLogLevelID){
		var type = "INTERNAL";
		switch(pLogLevelID){
			case 0:
				type = "FATAL_ERROR";
			break;
			case 1:
				type = "ERROR";
			break;
			case 2:
				type = "WARNING";
			break;
			case 3:
				type = "DEBUG";
			break;
			case 4:
				type = "INFO";
			break;
			case 5:
				type = "INTERNAL";
			break;
			case 6:
				type = "DEV";
			break;
		}

		return type;
	}
};