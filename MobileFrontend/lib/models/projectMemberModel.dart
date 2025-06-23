class ProjectMember {
  final String userId;
  final String role;
  final String name;

  ProjectMember({
    required this.userId,
    required this.role,
    required this.name,
  });

  factory ProjectMember.fromJson(Map<String, dynamic> json) {
    return ProjectMember(
      userId: json["userId"],
      role: json["role"],
      name: json["user"]["uname"],
    );
  }
}
