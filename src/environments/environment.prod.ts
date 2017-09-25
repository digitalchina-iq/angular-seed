export const environment = {
  debounceTime:500,
  production: true,
  server:'/api/'
};

export const PersonAPIConfig = {
  userImagePattern:`https://m.digitalchina.com/DCMobile2/HeadImage/{{userEN}}_middle.jpg?OpenId=3.1415926&SysType=m`,
	searchUrlPattern:environment.server+"persons?search_LIKE_name_1={{search_key}}&search_LIKE_itcode_2={{search_key}}&formula=1 OR 2&pageSize=40"
}
