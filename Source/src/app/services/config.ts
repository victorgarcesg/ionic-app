export const ConfigData = {

  // DEFINE YOUR URL
  'rootUrl': 'https://oracionpoderosa.info/wp-json/wp/v2/',

  'authDataKey': 'authSession',
  'notAuthUserData': 'notAuthUser',
  'notificationReceivedKey': 'notificationReceivedKey',

  // SOCIAL NETWORK
  'socialLink': {
    'facebook': 'https://www.facebook.com/',
    'twitter': 'https://twitter.com',
    'youtube': 'https://www.youtube.com/',
    'instagram': 'https://www.instagram.com/'
  },
  'googlePlayPath': '',


  // SHOW ALL YOUR CATEGORIES ( TRUE - display all category )
  'isExcludeCategoryEnabled': true,

  'excludeFromMenu': {
    // 'travel': true,
  },

  'includeFromMenu': {
    //'travel': true
  },


  // INTRO PAGE IN APP ( TRUE - slider is enable)
  'introData': true,

  // SETTINGS PARAMS fOR ONE SIGNAL
  'oneSignal': {
    'appID': 'b005be34-b574-4f88-badb-a8a28fd6c054',
    'googleProjectId': '678722387245'
  },


  // ENABLE OR DISABLE PUSH NOTIFICATION
  'defaultValueForPushNotification': true,


  // SETTINGS DEFAUTL COLOR COMBINATION (Is set Light color combination)
  'isLightColorSelected': true,


  // SETTINGS RTL ( FALSE - is not set rtl default  )
  'defualtValueForRTL': false,


  // SETTINGS FEATURES POTS TO SLIDER (FALSE - slider is enable)
  'isFeaturesPostsGetFromSticky': false,


  // SLIDER NUMBER BUT IT IS NOT STICKY ( isFeaturesPostsGetFromSticky:FALSE)
  'numberOfItemForSlider': 3,

  // SETTINGS NUMBER POSTS ON CATEGORY
  'numberOfItemPerPage': 30,

  'isCacheCategoryEnabled': false,
  'cacheExpiredTime': 24 * 60 * 60 * 1000,

  'bannerAds': {
    'enable': true,
    'config': {
      'id': '',
      'isTesting': true,
      'autoShow': true
    }
  },

  // How to set time open ADS page
  'interstitialAds': {
    'showAdsAfterXPosts': 8,
    'enable': true,
    'config': {
      'id': '',
      'isTesting': true,
      'autoShow': true
    }
  }
};
