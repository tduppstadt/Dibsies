$(document).ready(function()
{
	
 	var self = this;

	this.loadInProgress = false;
  
   
	// create template id lookup
	this.templateLookUp = {};
	var temp = $("#custom-preview").attr("data-template-lookup").split(",");
	for (var i = 0; i < temp.length; i++)
	{		
		this.templateLookUp[temp[i].split("=")[0]] = temp[i].split("=")[1];
	}	
    //console.log("templateLookUp:" + this.templateLookUp);

    
	//Automatically submit the preview form if proper parameters were passed in
	var pzText = getParameterByName('pzText');
  	console.log("pzText", pzText);
  	var formPzText = document.getElementById("Personalized Text");
  
  	if (pzText != null) {
    	
		formPzText.value = pzText;
      	//document.getElementById('custom-preview').click();
            
      $( window ).load(function() 
      {
        $("#custom-preview").trigger("click");
    	});
      
    }
  
	// preview button
	$("#custom-preview").on("click", function()
     {
		if (self.loadInProgress) return;
		if (self.validateForm()) return;
      	
        // specifically for slimmed down preview page
        var href = $("a.product-page-link").attr('href');
      	if (href != null) {
      		var href_no_querystring = href.split("?")[0];
        	console.log(href_no_querystring);
      		$("a.product-page-link").attr("href", href_no_querystring + '?pzText=' + formPzText.value);
          	$("input.product-page-link").attr("onClick", "javascript:location.href='" + href_no_querystring + "?pzText=" + formPzText.value +"';");
        }
		
        self.getPreview();

	});
		
	// ______________________________________________________________
    //                                                    toTitleCase
	this.toTitleCase = function(str)
	{
      // if 3 letters or less, ignore this.  allow capitalized initials
      if (str.length > 3) {
        
        // see how many letters are capitalized
        
        var i=0;
        var character='';
        var capitalizedLetterCounter = 0;
        var firstLetterCapitalized = false;
        
        while (i < str.length){
          character = str.charAt(i);
          console.log("character:" + character);
          console.log("str.length:" + str.length);
          console.log("i:" + i);
          if (character == character.toUpperCase() && character !== character.toLowerCase()) {
            if (i == 0) {
              firstLetterCapitalized = true;
            }
            capitalizedLetterCounter++;
          }
          console.log("capitalizedLetterCounter:" + capitalizedLetterCounter);
          i++;
        }        
        
        console.log("firstLetterCapitalized" + firstLetterCapitalized);
        
        // if the first letter is in caps and only 2 letters total are capitalized, ignore.  Allow names like Mckenzie
        if (firstLetterCapitalized && capitalizedLetterCounter == 2) {
          return str;
        }
        else {
        	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      
        }
      }
      else {
        return str;
      }
    }

	// ______________________________________________________________
    //                                                   validateForm
	this.validateForm = function()
	{ 
		console.log ("in validate form");
        // clear errors
		$(".error", ".personalize-full-form").remove();

		var err = "";
		var isError = false;
      	var isMonogram = $("#custom-preview").attr("is-monogram");
          
      
        if (isMonogram) 
        {

          if (typeof variantsku !== undefined) {
            var variantSkuName = variantsku;
            var lastChar = Number(variantSkuName.substr(variantSkuName.length - 1));
            console.log("lastChar: " + lastChar);
            if (lastChar == 4) {
              console.log("here1lastChar: " + lastChar);
              if ($(".customText").val() === "")
              {
                isError = true;
                err += "<p class='error'>Personalized Text is required</p>";
                console.log("in here now");
               
              }
            }
            else if (lastChar < 4) {
              console.log("here2lastChar: " + lastChar);
              console.log("customName1: " + $(".customName1").val());
              if ($(".customName1").val() === "")
              {
                console.log("customName1 is blank");
                isError = true;
                err += "<p class='error'>Monogram Initials are required</p>";
              }
              if (lastChar > 1) {
                console.log("here3lastChar: " + lastChar);
                if ($(".customName2").val() === "")
                {
                  isError = true;
                  err += "<p class='error'>Monogram Initials are required</p>";
                }
                if (lastChar > 2) {
                  console.log("here4lastChar: " + lastChar);
                  if ($(".customName3").val() === "")
                  {
                    isError = true;
                    err += "<p class='error'>Monogram Initials are required</p>";
                  }
                }
              }
            } 
            console.log("variantsku: " + variantSkuName);
          }

        }
      	else {
      
          if ($(".customFont").val() === "")
          {
              isError = true;
              err += "<p class='error'>Font is required</p>";
          }
          if ($(".customColor").val() === "")
          {
              isError = true;
              err += "<p class='error'>Text Color is required</p>";
          }

          console.log("customText" + $(".customText").val());

          if ($(".customText").val() === "")
          {
              isError = true;
              err += "<p class='error'>Personalized Text is required</p>";
          }

          console.log("customTitle" + $(".customTitle").val());

          if ($(".customTitle").val() === "")
          {
              isError = true;
              err += "<p class='error'>Personalized Title is required</p>";
          }

          //$(".personalize-full-form").append(err);

          console.log ("itemColor:", $(".itemColor").val());

          
      }
      $(".personalize-full-form").append(err);
      return (isError);

	};

	// ______________________________________________________________
    //                                                   clearPreview
	this.clearPreview = function()
	{ 
		$("#preview-out").html("");
      	$("#preview-out-main-image").html("");
	};

	// ______________________________________________________________
    //                                                 loadingPreview
	this.loadingPreview = function()
	{ 
		var htm = "<div style='height:25px; padding-top:15px;text-align:center;padding-bottom: 75px;'><div class='loading-gif'></div><div style='color: #2957A4;'><b>Loading...</b></div></div>";
		$("#preview-out").html(htm);
      	$("#preview-out-main-image").html(htm);
	};

	// ______________________________________________________________
    //                                                    showPreview
	this.showPreview = function(url)
	{ 
      
      var httpsUrl = url.replace('http://','https://');
      // below replace method added to escape apostrophes or single quotes from url
      var htm = "<img style='max-width:100%;' src='" + httpsUrl.replace(/'/g, "%27") + "' width='400px' id='previewimg'/>";
      htm += "<div style='max-width:100%; color: #2957A4; font-style:italic; padding-bottom:25px;'>This preview image is a simulation of your personalization options applied to this product</div>"
		
        $("#preview-out").html(htm);
      	$("#preview-out-main-image").html(htm);
      	$("#main-img").attr("src",httpsUrl);
        
      	//$(".main-image").css("display", "none");
      	//$(".zoomPad").css("display", "none");
      	$("#preview-image-url").attr("value",httpsUrl);
	};


	// ______________________________________________________________
    //                                                checkCloudinary
	this.checkCloudinary = function(arg, callback)
	{ 
     
      	  var publicId = buildCloudinaryPublicId(arg);
      	  var url = "https://res.cloudinary.com/dibsies/image/upload/" + publicId + ".jpg";
      	  
      	  console.log ("new logic builds cloudinary url:", url);
          
        $.ajax(
		{
			url   : url,
			type  : "HEAD",
			error : function(arg)
		    {
		    	callback(
                {
                  	response: "error",
                    url		: url
                
                });
		    },
		    success: function(arg)
		    {		        
		      	callback(
		      	{
					response : "success",
					url      : url
		      	});
		    }
		});

	};

	// ______________________________________________________________
    //                                                     getPreview
	this.getPreview = function()
	{  
		var self = this;
		self.loadInProgress = true;
		var n;
		// check case restriction
        if ($(".customText").val() != null){
          n = $(".customText").val();
        }
		var restr = $("#custom-preview").attr("data-case-restriction");
        console.log("data-case-restriction",restr);
        if (n != null) {
          switch(restr)
          {
            case "Upper & Lower":			
              n = self.toTitleCase(n);				
              break;
              
            case "UPPER & LOWER":			
              n = self.toTitleCase(n);				
              break;  
              
            case "All Upper":
              n = n.toUpperCase();
              break;
              
            case "ALL UPPER":
              n = n.toUpperCase();
              break;              
              
            case "All Lower":
              n = n.toLowerCase();
              break;
            
            case "ALL LOWER":
              n = n.toLowerCase();
              break;  
          }
        }
      
        var isVerticalText = $("#custom-preview").attr("vertical-text");
        console.log("vertical-text",isVerticalText);
      
      	if (isVerticalText == 1) {
          	console.log("n",n);
        	n = n.split('').join('\r\n'); 
          	console.log("n",n);
        }
        
      
		$("[data-fieldname='Personalized Text']").val(n);

		// get template id

        var currentSku;
        if (typeof variantsku !== "undefined") {
			currentSku = variantsku;
        }
      	else{
			currentSku = $("#custom-preview").attr("data-sku");
        }
      
      	var previewData = 
          {
            sku   : currentSku,
            name  : n
          };     

        console.log("sku",previewData.sku);
      	console.log("name",previewData.name);
      
        // the template-id-map is passed in from liquid page.  if not populated, this is a PGS item 
      	// so design-template-lookup will be passed in instead
      
      	if ($("#custom-preview").attr("data-template-lookup") != "")
        {
          previewData.idType = "template";  
          
          if ($(".customFont").val() == null){
            previewData.font = 'default';
          }
          else{  
          	previewData.font = $(".customFont").val().toLowerCase().split(' ').join('');
          
          }
          
          if ($(".customColor").val() == null){
            previewData.color = 'default';
          }
          else {
          	previewData.color = $(".customColor").val().toLowerCase().split(' ').join(''); 
          }
          
          if ($(".customDate").val() == null || $(".customDate").val() == ""){
            //previewData.date = 'default';
          }
          else {
          	previewData.date = $(".customDate").val(); 
            console.log("previewData.date:",previewData.date);
            var isSplitDate = $("#custom-preview").attr("split-date");
            if (isSplitDate == 1) {
              var splitDateArray = previewData.date.split(" ");
              previewData.threelettermonth = splitDateArray[0];
              previewData.dayofmonth = splitDateArray[1].substring(0,splitDateArray[1].length - 1);
              previewData.fourdigityear = splitDateArray[2];
              console.log("month:",previewData.threelettermonth);
              console.log("day:",previewData.dayofmonth);
              console.log("year:",previewData.fourdigityear);
          	}
          }
          
          if ($(".customYear").val() == null || $(".customYear").val() == ""){
            //previewData.year = 'deflt';
          }
          else {
          	previewData.year = $(".customYear").val(); 
            console.log("previewData.year:",previewData.year);
          }
         
          if ($(".customTitle").val() == null || $(".customTitle").val() == ""){
            //
          }
          else {
          	previewData.title = $(".customTitle").val(); 
            console.log("previewData.title:",previewData.title);
          }
          
          if ($(".customNumber").val() == null || $(".customNumber").val() == ""){
            //
          }
          else {
          	previewData.number = $(".customNumber").val(); 
            console.log("previewData.number:",previewData.number);
          }
          
          var numberOfNames = $("#custom-preview").attr("number-of-names");
          var numberOfYears = $("#custom-preview").attr("number-of-years");
          var alternateNamesDates = $("#custom-preview").attr("alternate-names-dates");
          
          // numberOfYears and numberOfNames are interchangeable from the perspective of preview.
          // They are only configured separately to drive the UI labeling.  If numberOfYears is 
          // not zero, set it to be numberOfNames here so it can be used throughout the rest of the 
          // code.
          if (numberOfYears > 0) {
            numberOfNames = numberOfYears;
          }
          
          var hasBackgroundInitial = $("#custom-preview").attr("has-background-initial");
          console.log("hasBackgroundInitial:" + hasBackgroundInitial);
          if (hasBackgroundInitial) {
            previewData.initial = $(".customText").val().charAt(0);
          }
          
          
          var isMonogram = $("#custom-preview").attr("is-monogram");
          var numberOfTextLines = $("#custom-preview").attr("number-of-pz-text-lines");
          console.log("numberOfTextLines" + numberOfTextLines);
          if (isMonogram){
            previewData.isMonogram = true;
            if (typeof variantsku !== undefined) {
              var variantSkuName = variantsku;
              var lastChar = Number(variantSkuName.substr(variantSkuName.length - 1));
              if (lastChar == 2 || lastChar == 3) {
                numberOfNames = lastChar;
              }
              else if (lastChar == 1) {
				previewData.name = $(".customName1").val();
                numberOfNames = lastChar;
              }
            }
          }
          if (numberOfTextLines > 0) {
            numberOfNames = numberOfTextLines;
          }
          if (numberOfNames > 0 ){
            
            previewData.namesArray = [];  
            
            if (alternateNamesDates) {
              previewData.datesArray = [];
            }
            
            
            for (var i = 1; i <= numberOfNames; i++){	
              
              
              if ($(".customName" + i).val() != null && $(".customName" + i).val() != "") {
                  console.log("customName" + $(".customName" + i).val());
                if (isMonogram) {
                  previewData.namesArray[i] = ($(".customName" + i).val()).toUpperCase();
                }
                else {
                  previewData.namesArray[i] = ($(".customName" + i).val());
                  if (alternateNamesDates) {
                    previewData.datesArray[i] = ($(".customDate" + i).val());
                  }
                }
                console.log(previewData.namesArray[i]);
              }
              else {             
                numberOfNames = i - 1;
                console.log("numberOfNames" + numberOfNames);
                break;
              }
            }	
            console.log("FinalNumberOfNames" + numberOfNames);
            previewData.numberOfNames = numberOfNames;
            previewData.dynamicMultiName = $("#custom-preview").attr("is-dynamic-multiname");
            
            console.log("numberOfNames:" + numberOfNames);
          }
          console.log("data template level:",$("#custom-preview").attr("data-template-level"));
          // if the template id map is keyed off of skus, look up by sku.  if keyed off font, lookup by font.  If it i
          if ($("#custom-preview").attr("data-template-level") == 1){
            console.log("data template level 1");
            previewData.templateId = self.templateLookUp[currentSku];
          }
          else if ($("#custom-preview").attr("data-template-level") == 2){
                        console.log("data template level 2");
            if (typeof variantsku !== undefined) {
              	var lookupKey = variantsku + "|" + previewData.font;
              console.log(lookupKey);
            	previewData.templateId = self.templateLookUp[lookupKey];
            }
            console.log(previewData.templateId);
          }
          else{
          	previewData.templateId = self.templateLookUp[previewData.font];
          }
		  self.generatePreview(previewData,"");
        }
        else if ($("#custom-preview").attr("data-design-lookup") != "")
        {
          previewData.designId = $("#custom-preview").attr("data-design-lookup");
          previewData.designTableKey = $("#custom-preview").attr("data-design-table-key");
          previewData.date = $(".customDate").val();
          previewData.customText = $(".customText").val();
          previewData.customText1 = $(".customText1").val();
          previewData.customText2 = $(".customText2").val();
          previewData.customText3 = $(".customText3").val();
          previewData.customTitle = $(".customTitle").val();
          previewData.customText = $(".customText").val();
          previewData.itemColor = $(".itemColor").val();
          previewData.idType = "design";
          console.log("designTableKey", previewData.designTableKey);
          console.log("customText1", previewData.customText1);
          console.log("customText2", previewData.customText2);
          console.log("customText3", previewData.customText3);
          console.log("customText", previewData.customText);
          console.log("customDate", previewData.date);
          
          self.checkCloudinary(previewData, function(arg)
          {
              switch (arg.response)
              {
                  case "error":
                      console.log("error");
                      console.log("cloudUrl used", arg.url);
                      self.generatePreview(previewData,arg.url);
                      break;

                  case "success":
                      console.log("success");
                      console.log("cloudUrl used", arg.url);
                      self.loadInProgress = false;
                      self.showPreview(arg.url);
                      break;
              }
          });
        }
				

		console.log("font", previewData.font);
		console.log("color", previewData.color);
		console.log("name", previewData.name);
		console.log("templateId", previewData.templateId);

		
    };

    // ______________________________________________________________
    //                                                generatePreview
	this.generatePreview = function(arg,cloudUrl)
	{ 
		// show loading
		self.loadingPreview();

      	var url = "https://preview.dibsies.com/?page=template-preview-ecard;TemplateID=" + arg.templateId;

    	var data = {};
        if (arg.name != null) {
          data["_" + arg.color] =  arg.name;
          data["_" + arg.color + "2"] = arg.name.charAt(0);
        }
        data["_3lettermonth"] = arg.threelettermonth;
      	data["_dayofmonth"] = arg.dayofmonth;
      	data["_4digityear"] = arg.fourdigityear;
      	data["_year"] = arg.year;
      	data["_title"] = arg.title;
        data["_number"] = arg.number;
      	data["_initial"] = arg.initial;
        data["_numberOfNames"] = arg.numberOfNames;
        data["_date"] = arg.date;
      	data["Width"] = "600px";
      	data["Height"] = "600px";

       if (arg.namesArray != null) {
        for (var i = 0; i < arg.namesArray.length; i++)
        {	
          if (arg.isMonogram || arg.dynamicMultiName != 1) {
            data["_" + i] = arg.namesArray[i];
          }
          else {
            
            if (arg.datesArray != null) {
          		data["_" + "name " + arg.numberOfNames + "-" + i] = arg.namesArray[i];   
                data["_" + "date " + arg.numberOfNames + "-" + i] = arg.datesArray[i];
            }
            else{
            	data["_" + arg.numberOfNames + "-" + i] = arg.namesArray[i];   
            }
          }
        }
       }
     
      console.log("preview url used:", url);
      console.log("preview data used:", data);
      
      	$.ajax(
        {
			type        : "post",
			url         : url,
			data        : data,                  
			dataType    : "html",
			success: function(data)
			{
				console.log(" * <generatePreview>", data);     
              
              	// As of 9/24/16, we are not longer uploading zeta generated images to cloudinary.
                // only PGS generated images are uploaded first.
              	if (arg.idType == "design")
    			{   		 
                  self.uploadToCloud(arg, data, cloudUrl);    
                  console.log("cloudUrl used", cloudUrl);
    			}
              	else
                {
                  	console.log("preview url used", data);
              		self.showPreview(data);
                }
                self.loadInProgress = false;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) 
			{
				console.log("XMLHttpRequest:", XMLHttpRequest, "|textStatus:", textStatus, "|errorThrown:", errorThrown);    
				$("#preview-out").html("Preview Not Available"); 
              	$("#preview-out-main-image").html("Preview Not Available");
				self.loadInProgress = false;      
			}
          	
        });
	};

  
	// ______________________________________________________________
    //                                                  uploadToCloud
	this.uploadToCloud = function(arg, imgUrl, cloudUrl)
	{
		var self = this;      

        var publicId = buildCloudinaryPublicId(arg);
      	var newImgUrl = buildImageUrl(arg,imgUrl);
      	var url = "http://www.clearlogic.com/cloudinary/preview_dibsies.php?wm=false&public_id=" + publicId + "&image_url=" + encodeURIComponent(newImgUrl);
        var id = "789232352542AB22"; 
      
      	console.log("final upload url", url);
		console.log("cloudUrl", id);
      
		$.ajax(
		{
			async: false,
          	url   : url,
			data: {id: id},
			dataType: "jsonp",
			jsonp : "callback",
			jsonpCallback: "jsonpcallback",
          
          	error : function(arg)
		    {
		    	self.loadInProgress = false;
		    	console.warn("uploadToCloud error");
		    },
		    success: function(arg)
		    {		
		    	self.loadInProgress = false;        
		      	console.log("uploadToCloud success");
              	self.showPreview(cloudUrl); 
		    }
		});

	};
});


// Named callback function from the ajax call when jsonpbtn2 clicked
function jsonpcallback(rtndata) { 

	// Get the id from the returned JSON string and use it to reference the target jQuery object.
	var myid = "#"+rtndata.id; 
	//$(myid).feedback(rtndata.message, {duration: 4000, above: true});
  	console.log("in callback function", rtndata);
  	//self.showPreview(cloudUrl);
}

  //This will return a given query string parameter from the current url
  function getParameterByName(name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  
    
  
  function buildCloudinaryPublicId(arg) {
     var publicId = "";
    
    if (arg.idType == "template")
    { 
      if (arg.name != null) {
      	strippedName = arg.name.replace(/(\r\n|\n|\r)/gm,"");
      }
      else {
        strippedName = "";
      }
      publicId = arg.sku + "_" + arg.font + "_" + arg.color + "_" + strippedName;
      
      if (arg.namesArray != null) {
        for (var i = 0; i < arg.namesArray.length; i++)
        {		
          publicId = publicId + "_" + arg.namesArray[i];
          if (arg.datesArray != null)
          {	
            publicId = publicId + "_" + arg.datesArray[i];
          }
        }	
      }
    }
    else if (arg.idType == "design") 
    {
      if (arg.designTableKey == null || arg.designTableKey == "") {
        publicId = arg.sku + "_" + arg.name;       
      }
      else {
    
        switch(arg.designTableKey)
        {
            
          case "1":			
           	publicId = arg.sku + "_" + arg.customTitle; 				
            break; 
            
          case "2":			
            publicId = arg.sku + "_" + arg.customText1 + arg.customText2; 				
            break;
            
          case "3":
            publicId = arg.sku + "_" + arg.customText1 + arg.customText2; 				
            break;
            
          case "4":
            publicId = arg.sku + "_" + arg.customTitle + arg.name;
            break;
            
          case "5":
            publicId = arg.sku + "_" + arg.customTitle + arg.customText1 + arg.customText2;
            break;

          case "6":
            publicId = arg.sku + "_" + arg.customTitle + arg.customText1 + arg.customText2 + arg.customText3;
            break;            
        
          case "7":
            publicId = arg.sku + "_" + arg.customTitle + arg.customText1 + arg.customText2;
            break;   
            
          case "8":
            publicId = arg.sku + "_" + arg.customText1 + arg.customText2 + arg.customText3;
            break;     
        
          case "9":
           	publicId = arg.sku + "_" + arg.customTitle; 				
            break; 

        }
      }
      
    }
    
    if (arg.date != null) 
    {
      publicId = publicId + "_" + arg.date;
    }
    
    if (arg.year != null)
    {
      publicId = publicId + "_" + arg.year;
    }
    
    if (arg.number != null)
    {
      publicId = publicId + "_" + arg.number;
    }
    
    if (arg.title != null)
    {
      publicId = publicId + "_" + arg.title;
    }
    if (arg.numberOfNames > 0)
    {
      publicId = publicId + "_" + arg.numberOfNames;
    }
      
    console.log("publicId is now:" + publicId);
    // ampresand "&" causes problems during upload to cloudinary and encoding doesn't fix it.  
    // remove the ampresand from the publicId and replace with two dashes.
    publicId = publicId.replace(/&/gm,"--");
    return encodeURIComponent(publicId);        
  }
      

      
  function buildImageUrl(arg,imgUrl) {
    
    var newImgUrl;
    if (arg.idType == "template")
    {
      // remove protocol from image url
      newImgUrl = imgUrl.split("//")[1];
    }
    
    else if (arg.idType == "design") {
      var pgsRecipe = buildPGSRecipe(arg);
      newImgUrl = "www.giftsforyounow.com/preview.ashx?designid=" + arg.designId + pgsRecipe;
    }

    return newImgUrl;
  }


    
      
  function buildPGSRecipe(arg) {
    var pgsRecipe = "";
    
      if (arg.designTableKey == null || arg.designTableKey == "") {
        pgsRecipe = "&frame_0=" + encodeURIComponent(arg.name) + "&frame_3=" + encodeURIComponent(arg.name);
      }
      else {
    
        switch(arg.designTableKey)
        {
            
          // Encode individual uri components to ensure ampresand in text still works.  encoding the entire
          // String doesn't work as the regular ampresand in query string seems to confuse browser. 
            
          case "1":			
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle);				
            break;
            
          case "2":			
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customText1) + "%0a" + encodeURIComponent(arg.customText2);				
            break;
            
          case "3":
            
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customText1) + "&frame_1=" + encodeURIComponent(arg.customText2);			
            break;
            
          case "4":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle) + "&frame_1=" + encodeURIComponent(arg.name);
            break;
        
          case "5":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle) + "&frame_1=" + encodeURIComponent(arg.customText1) + "%0a" + encodeURIComponent(arg.customText2);
            break;
            
          case "6":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle) + "&frame_1=" + encodeURIComponent(arg.customText1) + "%0a" + encodeURIComponent(arg.customText2) + "%0a" + encodeURIComponent(arg.customText3);
            break; 
            
          case "7":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle) + "&frame_1=" + encodeURIComponent(arg.customText1) + "&frame_2=" + encodeURIComponent(arg.customText2);
            break;   
            
           case "8":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customText1) + "&frame_1=" + encodeURIComponent(arg.customText2) + "&frame_2=" + encodeURIComponent(arg.customText3);
            break;     
        
           case "9":
            pgsRecipe = "&frame_0=" + encodeURIComponent(arg.customTitle) + "&frame_1=" + encodeURIComponent(arg.customTitle);
            break;  
        }
      }
    
      if (arg.date != null) 
      {
        pgsRecipe = pgsRecipe + "&frame_1=" + arg.date;
      }
      return pgsRecipe;  
    
    
}