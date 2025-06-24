import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:task_manager/models/projectMemberModel.dart';
import 'package:task_manager/models/userProjectsModel.dart';

class ProjectService {
  static const String baseUrl = 'http://192.168.11.8:7000/tasks';

  static Future<List<UserProject>> getUserProjects(String userEmail) async {
    final url = Uri.parse('$baseUrl/projects/$userEmail');

    try {
      final response = await http.get(
        url,
        headers: {"Content-Type": "application/json"},
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList.map((e) => UserProject.fromJson(e)).toList();
      } else {
        throw Exception("Failed to load projects: ${response.statusCode}");
      }
    } catch (e) {
      throw Exception("Error fetching projects: $e");
    }
  }

  static Future<Map<String, dynamic>> sendProjectInvitation({
    required String to,
    required String projectId,
  }) async {
    final url = Uri.parse('$baseUrl/send-project-invitation');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"to": to, "projectId": projectId}),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return {"success": true, "message": data["message"]};
    } else {
      return {
        "success": false,
        "message": "Failed to send invitation: ${response.body}",
      };
    }
  }

  static Future<Map<String, dynamic>> joinProject({
    required String memberId,
    required String projectId,
  }) async {
    final url = Uri.parse('$baseUrl/join-project');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({"memberId": memberId, "projectId": projectId}),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return {
        "success": true,
        "message": data["message"],
        "userProject": data["userProject"],
      };
    } else {
      return {
        "success": false,
        "message": "Failed to join project: ${response.body}",
      };
    }
  }

  static Future<Map<String, dynamic>> createProject({
    required String title,
    required String description,
    required String userId,
    required DateTime endDate,
  }) async {
    final url = Uri.parse('$baseUrl/create-project');
    final body = {
      "title": title,
      "description": description,
      "userId": userId,
      "endDate":
          endDate.toIso8601String().split('T').first, 
    };

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(body),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {
          "success": true,
          "message": data["message"] ?? "Project created",
          "project": data["project"],
        };
      } else {
        final errorData = jsonDecode(response.body);
        return {
          "success": false,
          "message": errorData["message"] ?? "Failed to create project",
        };
      }
    } catch (e) {
      return {"success": false, "message": "Error: $e"};
    }
  }

  static Future<List<ProjectMember>> getProjectMembers(String projectId) async {
    final response = await http.get(
      Uri.parse("$baseUrl/project-members/$projectId"),
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = jsonDecode(response.body);
      return jsonData.map((e) => ProjectMember.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load members");
    }
  }
}
