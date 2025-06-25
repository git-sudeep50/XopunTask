import 'package:flutter/material.dart';
import 'package:task_manager/models/projectMemberModel.dart';
import 'package:task_manager/models/projectsModel.dart';
import 'package:task_manager/screens/page.dart';
import 'package:task_manager/screens/projectTasks.dart';
import 'package:task_manager/services/PorjectServices.dart';

class ProjectDetailsScreen extends StatefulWidget {
  final Project project;
  final String role;

  const ProjectDetailsScreen({
    super.key,
    required this.project,
    required this.role,
  });

  @override
  State<ProjectDetailsScreen> createState() => _ProjectDetailsScreenState();
}

class _ProjectDetailsScreenState extends State<ProjectDetailsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _currentTab = 0;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() {
          _currentTab = _tabController.index;
        });
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _sendInvitation(String toEmail, BuildContext context) async {
    try {
      final result = await ProjectService.sendProjectInvitation(
        to: toEmail,
        projectId: widget.project.pid,
      );

      if (result["success"] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result["message"] ?? "Invitation sent")),
        );
      } else {
        throw Exception(result["message"] ?? "Failed to send invitation");
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(" Error: $e")));
    }
  }

  void _showInviteDialog(BuildContext context) {
    String email = '';

    showDialog(
      context: context,
      builder:
          (_) => AlertDialog(
            title: const Text("Invite to Project"),
            content: TextField(
              decoration: const InputDecoration(labelText: "Email"),
              onChanged: (val) => email = val,
              keyboardType: TextInputType.emailAddress,
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text("Cancel"),
              ),
              ElevatedButton(
                onPressed: () async {
                  Navigator.pop(context);
                  await _sendInvitation(email, context);
                },
                child: const Text("Send Invite"),
              ),
            ],
          ),
    );
  }

  Widget _buildTabBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: TabBar(
        controller: _tabController,
        isScrollable: true,
        indicator: const UnderlineTabIndicator(
          borderSide: BorderSide(width: 2.5, color: Colors.redAccent),
          insets: EdgeInsets.symmetric(horizontal: 8.0),
        ),
        labelColor: Colors.redAccent,
        unselectedLabelColor: Colors.grey,
        labelStyle: const TextStyle(fontWeight: FontWeight.bold),
        tabs: const [
          Tab(text: "Overview"),
          Tab(text: "Tasks"),
          Tab(text: "Members"),
        ],
      ),
    );
  }

  Widget _buildMembersTab() {
    return FutureBuilder<List<ProjectMember>>(
      future: ProjectService.getProjectMembers(widget.project.pid),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text("Error: ${snapshot.error}"));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text("No members found"));
        }

        final members = snapshot.data!;
        return ListView.separated(
          itemCount: members.length,
          separatorBuilder: (_, __) => const Divider(),
          itemBuilder: (context, index) {
            final member = members[index];
            return ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person)),
              title: Text(member.name),
              subtitle: Text(member.userId),
              trailing: Text(member.role),
            );
          },
        );
      },
    );
  }

  Widget _buildOverviewTab() {
    final project = widget.project;
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ListView(
        children: [
          Text(
            "📌 Title: ${project.pname}",
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            "Description:\n${project.description}",
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 12),
          Text(
            "Owner: ${project.ownerId}",
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 12),
          Text(
            "Start Date: ${project.startDate.toLocal().toString().split(' ')[0]}",
          ),
          const SizedBox(height: 6),
          Text(
            "Due Date: ${project.dueDate.toLocal().toString().split(' ')[0]}",
          ),
          const SizedBox(height: 12),
          Text(
            "Status: ${project.status}",
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 12),
          Text(
            "Your Role: ${widget.role}",
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.blue,
            ),
          ),
          const SizedBox(height: 16),
          const Divider(),
          const Text("Project ID:"),
          SelectableText(
            project.pid,
            style: const TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.project.pname), toolbarHeight: 40),
      body: Column(
        children: [
          _buildTabBar(),
          const Divider(height: 0),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOverviewTab(),
                TasksTab(projectid: widget.project.pid),
                _buildMembersTab(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton:
          widget.role == 'OWNER' && (_currentTab == 0 || _currentTab == 2)
              ? FloatingActionButton.extended(
                onPressed: () => _showInviteDialog(context),
                label: const Text("Invite Member"),
                icon: const Icon(Icons.mail_outline),
              )
              : null,
    );
  }
}
