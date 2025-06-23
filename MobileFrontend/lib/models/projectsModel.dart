
class Project {
  final String pid;
  final String pname;
  final String description;
  final DateTime startDate;
  final DateTime dueDate;
  final String status;
  final String ownerId;

  Project({
    required this.pid,
    required this.pname,
    required this.description,
    required this.startDate,
    required this.dueDate,
    required this.status,
    required this.ownerId,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      pid: json['pid'],
      pname: json['pname'],
      description: json['description'],
      startDate: DateTime.parse(json['startDate']),
      dueDate: DateTime.parse(json['dueDate']),
      status: json['status'],
      ownerId: json['ownerId'],
    );
  }
}
