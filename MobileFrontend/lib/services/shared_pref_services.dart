import 'package:shared_preferences/shared_preferences.dart';



class PreferenceHelper {
  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('isLoggedIn') ?? false;
  }

  static Future<void> setLoggedIn(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', value);
  }

  static Future<void> setuserEmail( String value) async
  {
    final prefs= await SharedPreferences.getInstance();
    await prefs.setString("UserEmail", value);
   
  }
  static Future<String> getuserEmail() async
  {
    final prefs= await SharedPreferences.getInstance();
    return prefs.getString("UserEmail") ?? "no email";
  }
  static Future<int> setuserName( String value) async
  {
    final prefs= await SharedPreferences.getInstance();
    await prefs.setString("UserName", value);
    return 0;
  }
  static Future<String> getName() async
  {
    final prefs= await SharedPreferences.getInstance();
    return prefs.getString("UserName") ?? "None";
  }
  

  

}
