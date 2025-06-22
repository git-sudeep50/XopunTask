
import 'package:task_manager/models/projectsModel.dart';


class UserProject {
  final String userId;
  final String projectId;
  final String role;
  final Project project;

  UserProject({
    required this.userId,
    required this.projectId,
    required this.role,
    required this.project,
  });

  factory UserProject.fromJson(Map<String, dynamic> json) {
    return UserProject(
      userId: json['userId'],
      projectId: json['projectId'],
      role: json['role'],
      project: Project.fromJson(json['project']),
    );
  }
}
