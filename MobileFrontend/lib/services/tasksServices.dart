import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:task_manager/models/tasksModel.dart';

class TaskService {
  static const String baseUrl = 'http://192.168.11.8:7000/tasks'; 
  static Future<List<Task>> fetchProjectTasks(String projectId) async {
    final url = Uri.parse('$baseUrl/project-tasks/$projectId');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final List<dynamic> body = jsonDecode(response.body);
      return body.map((json) => Task.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load project tasks');
    }
    
  }

  static Future<Task> createTask(Map<String, dynamic> body) async {
  final response = await http.post(
    Uri.parse('$baseUrl/create-task'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );

  if (response.statusCode == 200 || response.statusCode == 201) {
    final data = jsonDecode(response.body);
    return Task.fromJson(data["task"]);
  } else {
    throw Exception("Failed to create task");
  }
}
static Future<void> updateTaskStatus(String taskId, String newStatus) async {
    final url = Uri.parse("$baseUrl/update-task/$taskId");

    print("DEBUG API CALL: Sending PATCH request to URL: $url");
    print("DEBUG API CALL: Request Body: ${jsonEncode({"status": newStatus})}");

    try {
      final response = await http.patch(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"status": newStatus}),
      );

      print("DEBUG API CALL: Response Status Code: ${response.statusCode}");
      print("DEBUG API CALL: Response Body: ${response.body}");

      if (response.statusCode != 200) {
        // Throw an exception with more details for better debugging
        throw Exception("Failed to update task status. Status: ${response.statusCode}, Body: ${response.body}");
      }
    } catch (e) {
      print("DEBUG API CALL: Error during HTTP PATCH request: $e");
      rethrow;
    }
  }


}
