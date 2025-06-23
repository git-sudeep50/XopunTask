import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:task_manager/models/projectsModel.dart';

class ProjectCard extends StatelessWidget {
  
  final Project project;
  final String role;
  final VoidCallback? onTap;

  const ProjectCard({
    required this.project,
    required this.role,
    this.onTap,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final due = DateFormat('dd MMM yyyy').format(project.dueDate);

    Color statusColor;
    switch (project.status.toUpperCase()) {
      case "COMPLETED":
        statusColor = const Color.fromARGB(45, 76, 175, 79);
        break;
      case "IN_PROGRESS":
        statusColor = const Color.fromARGB(45, 255, 153, 0);
        break;
      case "ASSIGNED":
      default:
        statusColor = const Color.fromARGB(45, 33, 149, 243);
        break;
    }

    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        child: ListTile(
          contentPadding: const EdgeInsets.all(12),
          title: Text(
            project.pname,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 6),
              Text(project.description),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: Colors.grey[700]),
                  const SizedBox(width: 4),
                  Text("Due: $due"),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: statusColor,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      project.status,
                      style: TextStyle(
                        color: Colors.black,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          trailing:
              role == "OWNER"
                  ? const Icon(Icons.shield_outlined, color: Colors.black54)
                  : const Icon(Icons.group_outlined, color: Colors.black54),
        ),
      ),
    );
  }
}
