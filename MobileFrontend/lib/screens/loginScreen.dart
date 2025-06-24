import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:task_manager/services/AuthServices.dart';
import 'package:task_manager/services/shared_pref_services.dart';

class AuthScreen extends StatefulWidget {
  AuthScreen({super.key, required this.loggedIn});
  Function loggedIn;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final TextEditingController emailCtrl = TextEditingController();
  final TextEditingController passCtrl = TextEditingController();
  final TextEditingController nameCtrl = TextEditingController();
  final TextEditingController otpCtrl = TextEditingController();
  bool isloading = false;

  bool isLogin = true;
  bool otpSent = false;

  void _sendOTP() async {
    try {
      var response = await AuthService.generateOtp(emailCtrl.text.toString());

      if (response != null) {
        setState(() {
          otpSent = true;
          isloading = false;
        });
      }
      if (response == null) {
        setState(() {
          isloading = false;
          print(response);
        });
      }
    } catch (e) {
      print("$e");
      isloading = false;
    }
  }

  void _signUp() async {
    final response = await AuthService.signUp(
      emailCtrl.text.toString(),
      otpCtrl.text.toString(),
      nameCtrl.text.toString(),
      passCtrl.text.toString(),
    );
    print(response?["verified"]);
    if (response?["verified"] == true) {
      // Successful signup
      final message = response?["message"];
      final userData = response?["userData"];
      final token = response?["token"];

      print("Signup successful: $message");
      print("User Data: $userData");
      print("Token: $token");
      PreferenceHelper.setuserName(userData["userName"]);
      PreferenceHelper.setLoggedIn(true);
      PreferenceHelper.setuserEmail(emailCtrl.text.toString());

      widget.loggedIn();
    } else {
      // Failed signup
      final error = response?["message"];
      print("Signup failed: $error");

     
    }
  }

  @override
  Widget build(BuildContext context) {
    final Color backgroundColor = const Color(0xFFE9F2FB);
    final Color primaryColor = const Color(0xFF4A80F0);

    return Scaffold(
      backgroundColor: backgroundColor,
      body:
          isloading
              ? LinearProgressIndicator()
              : Stack(
                children: [
                  _circleDecoration(),

                  SafeArea(
                    child: Center(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              isLogin
                                  ? "Welcome Back 👋"
                                  : otpSent
                                  ? "Enter OTP to Continue"
                                  : "Create Account ",
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E1E1E),
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 10),
                            Text(
                              isLogin
                                  ? "Login to your account"
                                  : otpSent
                                  ? "We've sent an OTP to ${emailCtrl.text}"
                                  : "Signup with your email",
                              style: const TextStyle(
                                fontSize: 16,
                                color: Color.fromARGB(255, 37, 36, 36),
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 40),

                            Container(
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color.fromARGB(128, 0, 0, 0),
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: Column(
                                children: [
                                  if (isLogin) ...[
                                    _textField(
                                      controller: emailCtrl,
                                      label: "Email",
                                      icon: Icons.email_outlined,
                                    ),
                                    const SizedBox(height: 16),
                                    _textField(
                                      controller: passCtrl,
                                      label: "Password",
                                      icon: Icons.lock_outline,
                                      obscure: true,
                                    ),
                                    const SizedBox(height: 16),
                                  ] else if (!otpSent) ...[
                                    _textField(
                                      controller: emailCtrl,
                                      label: "Email",
                                      icon: Icons.email_outlined,
                                    ),
                                  ] else ...[
                                    _textField(
                                      controller: otpCtrl,
                                      label: "OTP",
                                      icon: Icons.lock_clock_outlined,
                                    ),
                                    const SizedBox(height: 16),
                                    _textField(
                                      controller: nameCtrl,
                                      label: "Name",
                                      icon: Icons.person_outline,
                                    ),
                                    const SizedBox(height: 16),
                                    _textField(
                                      controller: passCtrl,
                                      label: "Password",
                                      icon: Icons.lock_outline,
                                      obscure: true,
                                    ),
                                  ],

                                  const SizedBox(height: 20),
                                  SizedBox(
                                    width: double.infinity,
                                    height: 50,
                                    child: ElevatedButton(
                                      onPressed: () {
                                        if (isLogin) {
                                          // login logic
                                        } else {
                                          if (!otpSent) {
                                            setState(() {
                                              isloading = true;
                                            });
                                            _sendOTP();
                                          } else {
                                            _signUp();
                                          }
                                        }
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: primaryColor,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            12,
                                          ),
                                        ),
                                      ),
                                      child: Text(
                                        isLogin
                                            ? "Login"
                                            : otpSent
                                            ? "Sign Up"
                                            : "Send OTP",
                                        style: const TextStyle(
                                          fontSize: 18,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 24),

                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  isLogin
                                      ? "Don't have an account? "
                                      : "Already have an account? ",
                                ),
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      isLogin = !isLogin;
                                      otpSent = false;
                                      emailCtrl.clear();
                                      passCtrl.clear();
                                      nameCtrl.clear();
                                      otpCtrl.clear();
                                    });
                                  },
                                  child: Text(
                                    isLogin ? "Sign Up" : "Login",
                                    style: TextStyle(
                                      color: primaryColor,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
    );
  }

  Widget _textField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscure = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  Widget _circleDecoration() {
    return Stack(
      children: [
        Positioned(
          top: -80,
          left: -60,
          child: _circle(200, const Color(0xFF4A80F0)),
        ),
        Positioned(
          bottom: -100,
          right: -50,
          child: _circle(250, const Color(0xFF6FB1FC)),
        ),
        Positioned(
          top: 200,
          right: -80,
          child: _circle(150, const Color(0xFF4AD5F0)),
        ),
      ],
    );
  }

  Widget _circle(double size, Color color) {
    return Container(
      height: size,
      width: size,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }
}
