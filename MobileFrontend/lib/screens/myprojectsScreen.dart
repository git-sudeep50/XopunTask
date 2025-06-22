import 'package:flutter/material.dart';
import 'package:icons_plus/icons_plus.dart';
import 'package:task_manager/customwigdets/projectCard.dart';
import 'package:task_manager/models/userProjectsModel.dart';
import 'package:task_manager/screens/project_details_screen.dart';
import 'package:task_manager/services/PorjectServices.dart';
import 'package:task_manager/services/shared_pref_services.dart';

class Myprojectsscreen extends StatefulWidget {
  const Myprojectsscreen({super.key});

  @override
  State<Myprojectsscreen> createState() => _MyprojectsscreenState();
}

class _MyprojectsscreenState extends State<Myprojectsscreen> {
  List<UserProject> ownerProjects = [];
  List<UserProject> memberProjects = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadProjects();
  }
void _joinProject(String projectId) async {
  final email = await PreferenceHelper.getuserEmail();

  try {
    final result = await ProjectService.joinProject(
      memberId: email,
      projectId: projectId,
    );

    if (result["success"]) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result["message"] ?? "Joined successfully")),
      );
      loadProjects(); // Refresh UI
    } else {
      throw Exception(result["message"]);
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("❌ Error: $e")),
    );
  }
}

  // Load Projects
  void loadProjects() async {
    final email = await PreferenceHelper.getuserEmail();
    try {
      final result = await ProjectService.getUserProjects(email);
      setState(() {
        ownerProjects = result.where((p) => p.role == 'OWNER').toList();
        memberProjects = result.where((p) => p.role == 'MEMBER').toList();
        isLoading = false;
      });
    } catch (e) {
      print("❌ Error loading projects: $e");
      setState(() => isLoading = false);
    }
  }

  // Create Project
  void _createProject(String name, String description, String date) async {
    final email = await PreferenceHelper.getuserEmail();
    final result = await ProjectService.createProject(
      title: name,
      description: description,
      userId: email,
      endDate: DateTime.parse(date),
    );

    if (result["success"]) {
      print("✅ Project Created: ${result["project"]}");
      loadProjects(); // Refresh list
    } else {
      print("❌ Error: ${result["message"]}");
    }
  }

  // Show Project Creation Dialog
  void _showAddProjectDialog() {
    String name = '';
    String description = '';
    String date = '';

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Create Project'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Project Name',
                      ),
                      onChanged: (val) => name = val,
                    ),
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Description',
                      ),
                      onChanged: (val) => description = val,
                    ),
                    GestureDetector(
                      onTap: () async {
                        final DateTime? picked = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime(2000),
                          lastDate: DateTime(2100),
                        );
                        if (picked != null) {
                          setState(() {
                            date =
                                "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
                          });
                        }
                      },
                      child: AbsorbPointer(
                        child: TextField(
                          controller: TextEditingController(text: date),
                          decoration: const InputDecoration(
                            labelText: 'End Date',
                            hintText: 'Select date',
                            suffixIcon: Icon(Icons.calendar_today),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (name.trim().isNotEmpty && date.isNotEmpty) {
                      _createProject(name.trim(), description.trim(), date);
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Create'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  // Show Join Project Dialog
  void _showJoinProjectDialog() {
    String code = '';
    showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            title: const Text('Join Project'),
            content: TextField(
              decoration: const InputDecoration(labelText: 'Project Code'),
              onChanged: (val) => code = val,
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  if (code.trim().isNotEmpty) {
                    _joinProject(code.trim());
                    Navigator.pop(context);
                  }
                },
                child: const Text('Join'),
              ),
            ],
          ),
    );
  }

  // Build Floating Buttons
  Widget buildFloatingButtons() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _ProjectActionButton(
          label: 'Create Project',
          icon: Icons.add,
          onPressed: _showAddProjectDialog,
        ),
        const SizedBox(height: 10),
        _ProjectActionButton(
          label: 'Join Project',
          icon: Icons.group_add,
          onPressed: _showJoinProjectDialog,
        ),
      ],
    );
  }

  // Build Project Sections
  Widget buildProjectSection(String title, List<UserProject> projects) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      ...projects.map((p) => ProjectCard(
        project: p.project,
        role: p.role,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProjectDetailsScreen(project: p.project, role: p.role),
            ),
          );
        },
      )),
      const SizedBox(height: 16),
    ],
  );
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: buildFloatingButtons(),
      body: Container(
        color: const Color.fromARGB(56, 143, 231, 255),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 36),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Image.asset("assets/images/profileimage.png", height: 50),
                const Icon(HeroIcons.bell_alert, size: 32),
              ],
            ),
            const SizedBox(height: 14),
            Expanded(
              child:
                  isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : ListView(
                        children: [
                          if (ownerProjects.isNotEmpty)
                            buildProjectSection(
                              " Owned Projects:",
                              ownerProjects,
                            ),
                          if (memberProjects.isNotEmpty)
                            buildProjectSection(
                              " Member Projects:",
                              memberProjects,
                            ),
                          if (ownerProjects.isEmpty && memberProjects.isEmpty)
                            const Center(
                              child: Text("No projects to display."),
                            ),
                        ],
                      ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProjectActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onPressed;

  const _ProjectActionButton({
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      label: Text(label),
      icon: Icon(icon),
      backgroundColor: Colors.white,
      onPressed: onPressed,
    );
  }
}
