$(document).ready(function()
{
	var self = this;

	this.loadInProgress = false;

	this.templateLookUp = 
	{
		"14156_library" : "C5B2F133-3F8F-4940-80E7-1EF39799AADD",
		"14156_marker"  : "3AABFE18-00CA-455D-A57E-B0FA775E9ED3",
		"14156_script"  : "0F33B3EB-CF1C-414C-93B8-8AEB6C820EAE"
	};

	// preview button
	$("#custom-preview").on("click", function()
	{
		if (self.loadInProgress) return;
		if (self.validateForm()) return;		
		self.getPreview();
	});
	

	// ______________________________________________________________
    //                                                   validateForm
	this.validateForm = function()
	{ 
		// clear errors
		$(".error", ".personalize-full-form").remove();

		var err = "";
		var isError = false;

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
		if ($(".customText").val() === "")
		{
			isError = true;
			err += "<p class='error'>Personalized Text is required</p>";
		}

		$(".personalize-full-form").append(err);

		return (isError);

	};

	// ______________________________________________________________
    //                                                   clearPreview
	this.clearPreview = function()
	{ 
		$("#preview-out").html("");
	};

	// ______________________________________________________________
    //                                                 loadingPreview
	this.loadingPreview = function()
	{ 
		var htm = "<div style='height:25px; padding-top:15px;text-align:center;padding-bottom: 75px;'><div class='loading-gif'></div><div style='color: #2957A4;'><b>Loading...</b></div></div>";
		$("#preview-out").html(htm);
	};

	// ______________________________________________________________
    //                                                    showPreview
	this.showPreview = function(url)
	{ 
		var htm = "<img src='" + url + "' width='400px'/>";
		htm += "<div style='color: #2957A4; font-style:italic; padding-bottom:25px;'>This preview image is a simulation of your personalization options applied to this product</div>"
		$("#preview-out").html(htm);
	};


	// ______________________________________________________________
    //                                                checkCloudinary
	this.checkCloudinary = function(arg, callback)
	{ 
		var url = "http://res.cloudinary.com/dibsies/image/upload/" + arg.sku + "_" + arg.font + "_" + arg.color + "_" + arg.name + ".jpg";
		$.ajax(
		{
			url   : url,
			type  : "HEAD",
			error : function(arg)
		    {
		    	callback({response: "error"});
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

		// check case restriction
		var n = $(".customText").val();
		var restr = $("#custom-preview").attr("data-case-restriction");
		switch(restr)
		{
			case "Upper & Lower":
				n = n.toLowerCase();
				n = n.charAt(0).toUpperCase() + n.slice(1);
				break;

			case "All Upper":
				n = n.toUpperCase();
				break;

			case "All Lower":
				n = n.toLowerCase();
				break;
		}
		$("[data-fieldname='Personalized Text'").val(n);

		var previewData = 
		{
			sku   : $("#custom-preview").attr("data-sku"),
			font  : $(".customFont").val().toLowerCase().split(' ').join(''),
			color : $(".customColor").val().toLowerCase().split(' ').join(''),
			name  : $(".customText").val()
		};
		previewData.templateId = self.templateLookUp[previewData.sku + "_" + previewData.font];


		self.checkCloudinary(previewData, function(arg)
		{
			switch (arg.response)
			{
				case "error":
					self.generatePreview(previewData);
					break;

				case "success":
					self.loadInProgress = false;
					self.showPreview(arg.url);
					break;
			}
		});
				

		console.log("font", previewData.font);
		console.log("color", previewData.color);
		console.log("name", previewData.name);
		console.log("templateId", previewData.templateId);

		
    };

    // ______________________________________________________________
    //                                                generatePreview
	this.generatePreview = function(arg)
	{ 
		// show loading
		self.loadingPreview();

      	var url = "http://preview.dibsies.com/?page=template-preview-ecard;TemplateID=" + arg.templateId;

    	var data = {};
       	data["_" + arg.color] =  arg.name;       
      
      	$.ajax(
        {
			type        : "post",
			url         : url,
			data        : data,                  
			dataType    : "html",
			success: function(data)
			{
				console.log(" * <generatePreview>", data);     
				self.showPreview(data);   
				self.uploadToCloud(arg, data);    
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) 
			{
				console.log("XMLHttpRequest:", XMLHttpRequest, "|textStatus:", textStatus, "|errorThrown:", errorThrown);    
				$("#preview-out").html("Preview Not Available"); 
				self.loadInProgress = false;      
			}
        });
	};

	// ______________________________________________________________
    //                                                  uploadToCloud
	this.uploadToCloud = function(arg, imgUrl)
	{
		var self = this;

		// remove protocol from image url
		imgUrl = imgUrl.split("//")[1];
		
		var url = "http://www.clearlogic.com/cloudinary/preview_dibsies.php?public_id=" + arg.sku + "_" + arg.font + "_" + arg.color + "_" + arg.name;
		url += "&image_url=" + imgUrl;
		
		$.ajax(
		{
			url   : url,
			
			error : function(arg)
		    {
		    	self.loadInProgress = false;
		    	console.warn("uploadToCloud error");
		    },
		    success: function(arg)
		    {		
		    	self.loadInProgress = false;        
		      	console.log("uploadToCloud success");
		    }
		});

	};

});