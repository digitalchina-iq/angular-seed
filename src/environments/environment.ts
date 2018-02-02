// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.


export const environment = {
  loginPath: 'login',
  debounceTime:500,
  production: false,
  server:'/api/'
};

export const PersonAPIConfig = {
  userImagePattern:`https://m.digitalchina.com/DCMobile2/HeadImage/{{userEN}}_middle.jpg?OpenId=3.1415926&SysType=m`,
	searchUrlPattern:environment.server+"persons?search_LIKE_name_1={{search_key}}&search_LIKE_itcode_2={{search_key}}&formula=1 OR 2&pageSize=40"
}
