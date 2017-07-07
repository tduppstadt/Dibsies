(function () 
{
    // https://developers.facebook.com/docs/reference/javascript/
    /*    
        The channel file addresses some issues with cross-domain communications in certain browsers. The contents of the channel.html file can be just a single line:
        <script src="//connect.facebook.net/en_US/all.js"></script>
     */
    // ---------------------------------------------------------------
    //
    // FACEBOOK JAVASCRIPT SDK
    //
    // ---------------------------------------------------------------
    var Social = function (fbAppId) {

        this.fbAppId        = fbAppId;
        this.channelUrl   = "";

        this.data = {
            'title'       : "This is my Title", //$("#socialPostTitle").text(),
            'description' : "This is my description",//$("#socialPostDescription").val(),
            'url'         : "google.com",//response.results.link,
            'image'       : "" //$("#socialPostImage").attr("src")
        };


        // window.tEvent.eventStr.FB_LOGIN_STATUS  = "FB_LOGIN_STATUS";
        // window.tEvent.eventStr.FB_STATUS_CHANGE = "FB_STATUS_CHANGE";
        // window.tEvent.eventStr.FB_INIT          = "FB_INIT";

        this.init();
    };

    Social.prototype = {
        // ______________________________________________________________
        //                                                           init
        init: function ()
        {
            var self = this;    
           
            this.initFB();
        },

        // ______________________________________________________________
        //                                                         initFB
        initFB: function ()
        {
            var self = this;

            window.fbAsyncInit = function() 
            {
                // init the FB JS SDK
                FB.init(
                {
                    appId      : self.fbAppId, // App ID from the App Dashboard
                    channelUrl : self.channelUrl, // Channel File for x-domain communication
                    status     : true, // check the login status upon init?
                    cookie     : true, // set sessions cookies to allow your server to access the session?
                    xfbml      : true,  // parse XFBML tags on this page?
                     version: 'v2.3'
                    
                });

                self.initFbLogin();
            };
            
            // Load the SDK's source Asynchronously
            // Note that the debug version is being actively developed and might 
            // contain some type checks that are overly strict. 
            // Please report such bugs using the bugs tool.
            (function(d)
            {
                var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement('script'); js.id = id; js.async = true;
                js.src = "//connect.facebook.net/en_US/all.js";
                ref.parentNode.insertBefore(js, ref);
            }(document));


        },


        initFbLogin: function(){

            var self = this;

            console.log("_____________________ initFbLogin");


            FB.getLoginStatus(function(response) {
                console.log("__________________getLoginStatus", response);
            }, true);
            

            FB.Event.subscribe('auth.login', function(response) {
                console.log("__________________login", response);
            });



            FB.Event.subscribe('auth.authResponseChange', function(response) {
                console.log("__________________authResponseChange", response);
            });

            var permissions = 'public_profile, email, user_friends';
            //FB.login(null,{scope:permissions});


            /*FB.getLoginStatus(function(response) {
                console.log("HELLLO!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
              if (response.status === 'connected') {
                console.log('Logged in.');
                self.facebookPopUp();
              }
              else {
                console.log('initiate FB login...');
                FB.login(function(){
                    self.facebookPopUp();
                });
              }
            });*/
        },

        // ______________________________________________________________
        //                                                  facebookShare
        /*
        var fbModel = 
            {
                title       : "My Title",
                description : "My Description",
                url         : "//www.google.com/",
                image       : "//www.google.com/logos/2013/ella_fitzgeralds_96th_birthday-1212009-hp.jpg"
            }

            this.social.facebookPopUp(fbModel, function()
            {
                console.log("facebookPopUp - GOT IT!");
                // pop up is going through but the API is not working
            }); 
         */                                                      
        facebookShare: function(activeModel, callback)
        {
            
            callback = function(x){
                console.log("__________FB posted!!", x);

            };

            var publish = 
            {
                method      : 'feed',
                name        : activeModel.title,                
                description : activeModel.description,
                link        : activeModel.url, // link on the title
                picture     : activeModel.image // min: 50x50, recommended: 200px x 200px
                //caption   : 'The Facebook Connect JavaScript SDK',
                /* actions: 
                [
                    { name: 'fbrell', link: '//www.fbrell.com/' } // link next to Like and Connect
                ],*/
                //user_message_prompt: 'Share your thoughts about RELL'
            };

            FB.ui(publish, callback);
      
        },

    };

    window.oSocial = new Social("142213419238560");

})();
