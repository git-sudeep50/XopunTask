import 'dart:convert';
import 'package:http/http.dart' as http; 
import 'package:task_manager/models/tasksModel.dart'; 

class TaskService {
  
  static const String baseUrl = 'http://192.168.11.8:7000/tasks';

  static Future<List<Task>> fetchProjectTasks(String projectId) async {
    final url = Uri.parse('$baseUrl/project-tasks/$projectId');
    print("DEBUG API CALL: Fetching tasks from: $url"); 
    final response = await http.get(url);

    print(
      "DEBUG API CALL: fetchProjectTasks Response Status Code: ${response.statusCode}",
    ); 
    print(
      "DEBUG API CALL: fetchProjectTasks Response Body: ${response.body}",
    ); 

    if (response.statusCode == 200) {
      final List<dynamic> body = jsonDecode(response.body);
      return body.map((json) => Task.fromJson(json)).toList();
    } else {
      throw Exception(
        'Failed to load project tasks. Status: ${response.statusCode}, Body: ${response.body}',
      );
    }
  }

  static Future<Task> createTask(Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl/create-task'); 
    print("DEBUG API CALL: Creating task at URL: $url"); 
    print(
      "DEBUG API CALL: Create Task Request Body: ${jsonEncode(body)}",
    ); 

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    print(
      "DEBUG API CALL: Create Task Response Status Code: ${response.statusCode}",
    ); 
    print(
      "DEBUG API CALL: Create Task Response Body: ${response.body}",
    ); 

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      if (data != null && data['task'] != null) {
        return Task.fromJson(data["task"]);
      } else {
        throw Exception(
          "Failed to create task: 'task' key not found in response.",
        );
      }
    } else {
      throw Exception(
        "Failed to create task. Status: ${response.statusCode}, Body: ${response.body}",
      );
    }
  }

  static Future<void> updateTaskStatus(String taskId, String newStatus) async {
    final url = Uri.parse('$baseUrl/update-task/$taskId');

    final body = jsonEncode({'status': newStatus});

    try {
      final response = await http.patch(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        print("✅ Task $taskId successfully updated to $newStatus");
      } else {
        print(
          "❌ Failed to update task $taskId. Status: ${response.statusCode}",
        );
        print("Response body: ${response.body}");
        throw Exception("Task update failed");
      }
    } catch (e) {
      print("❌ Exception occurred while updating task $taskId: $e");
      rethrow;
    }
  }

  // In TaskService
  static Future<Task> fetchTaskById(String taskId) async {
    final url = Uri.parse('$baseUrl/task/$taskId');
    final res = await http.get(url);

    if (res.statusCode == 200) {
      final jsonBody = json.decode(res.body);
      return Task.fromJson(jsonBody['task']);
    } else {
      throw Exception('Failed to fetch task');
    }
  }

  
  static Future<void> assignTask(String taskId, List<String> userIds) async {
    final url = Uri.parse('$baseUrl/assign-task');
    final body = jsonEncode({'taskId': taskId, 'userIds': userIds});
    final resp = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: body,
    );
    if (resp.statusCode != 200 && resp.statusCode != 201) {
      throw Exception('Failed to assign: ${resp.statusCode} ${resp.body}');
    }
  }
}
