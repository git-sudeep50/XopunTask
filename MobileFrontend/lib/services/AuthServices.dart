import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  static const String baseurl = "http://192.168.11.8:7000/auth";

  static Future<String?> generateOtp(String email) async {
    try {
      final url = Uri.parse("$baseurl/generate-otp");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        print("OTP Sent Successfully");
        return data["message"]; 
      } else {
        print("Failed to send OTP: ${response.statusCode}");
        print("Response body: ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error sending OTP: $e");
      return null;
    }
  }

  static Future<Map<String, dynamic>?> signUp(
    String email,
    String otp,
    String name,
    String password,
  ) async {
    try {
      final url = Uri.parse("$baseurl/verify-otp");

      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "otp": otp,
          "userName": name,
          "password": password,
        }),
      );

      print("Response Code: ${response.statusCode}");
      print("Response Body: ${response.body}");

      final body = jsonDecode(response.body);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {
          "verified": body["res"]?["verified"] ?? false,
          "message": body["res"]?["message"],
          "userData": body["userData"],
          "token": body["token"],
        };
      } else {
       
        return {
          "verified": false,
          "message":
              body["message"] ?? "Signup failed, please check OTP or try again",
        };
      }
    } catch (e) {
      print("Exception occurred during sign-up: $e");
      return {"verified": false, "message": "An error occurred: $e"};
    }
  }
}
