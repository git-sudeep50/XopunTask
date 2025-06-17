import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:task_manager/screens/page.dart';

class StatusCard extends StatelessWidget {
  final String title;
  final Color color;
  final double width;

  const StatusCard({
    super.key,
    required this.title,
    required this.color,
    required this.width,
  });
  void _openNewPage(BuildContext context) {
    Navigator.of(context).push(MaterialPageRoute(builder: (ctx) => NewPage()));
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color, // Let your container's color show through
      borderRadius: BorderRadius.circular(25),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          _openNewPage(context);
        },
        borderRadius: BorderRadius.circular(25),
        splashColor: const Color.fromARGB(123, 0, 0, 0),
        child: Container(
          height: 90,
          width: width,
          padding: const EdgeInsets.all(6),
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            //color: color,
            borderRadius: BorderRadius.circular(25),
            //border: Border.all(color: Colors.black)
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.montserrat(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),

              RichText(
                text: TextSpan(
                  text: "14",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  children: [
                    TextSpan(
                      text: " tasks →",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
