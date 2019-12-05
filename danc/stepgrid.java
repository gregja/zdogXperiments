//Creates a stepped datagrid as a connected mesh using only quads and triangles 
// https://pastebin.com/9DsG3Jhz
// https://www.patreon.com/wblut


float[][] values;
DataGrid grid;

void setup() {
  size(1000, 1000, P3D);
  smooth(8);
  values=new float[12][12];
  //random grid surrounded with a band of cells at value=0.0
  for (int column=1; column<11; column++) {
    for (int row=1; row<11; row++) {
      values[column][row]=random(1.0, 5.0);
    }
  }
  grid=new DataGrid(values, -0.2);//values as float[][], value of base
  grid.saveAsSTL("demo",5, 5, 10, -30, -30, 0.2);
  noCursor();
}

void draw() {
  background(250);
  stroke(10);
  translate(width/2, height/2);
  lights();

  rotateX(map(mouseY, height, 0, -PI, PI));
  rotateZ(map(mouseX, 0, width, -PI, PI));
  //draw with parameters: size per division in X direction, size per division in X direction, scale factor for value,
  //                      offset in X direction, offset in Y direction, offset in value
  grid.draw(40, 40, 50, -240, -240, -100);
}



class DataGrid {
  ArrayList<GridFace> faces;
  int columns, rows;
  float[][] values;
  float baseValue;

  DataGrid(float[][] values, float baseValue) {
    assert(values.length>0);
    assert(values[0].length>0);
    columns=values.length;
    rows=values[0].length;
    this.values=values;
    this.baseValue=baseValue;
    createGridFaces();
  }

  void createGridFaces() {
    faces=new ArrayList<GridFace>();
    GridPoint p1, p2, p3, p4;

    // Top faces: squares at height=value
    for (int column = 0; column < columns; column++) {
      for (int row = 0; row < rows; row++) {
        p1 = new GridPoint(column, row, getValue(column, row, baseValue));
        p2 = new GridPoint(column + 1, row, getValue(column, row, baseValue));
        p3 = new GridPoint(column + 1, row + 1, getValue(column, row, baseValue));
        p4 = new GridPoint(column, row + 1, getValue(column, row, baseValue));
        faces.add(new GridFace(p1, p2, p3, p4));
      }
    }

    // Bottom faces: squares at height=base
    for (int column = 0; column < columns; column++) {
      for (int row = 0; row < rows; row++) {
        p1 = new GridPoint(column, row, baseValue);
        p2 = new GridPoint(column + 1, row, baseValue);
        p3 = new GridPoint(column + 1, row + 1, baseValue);
        p4 = new GridPoint(column, row + 1, baseValue);
        faces.add(new GridFace(p4, p3, p2, p1));
      }
    }

    // If two neighboring cells have a different value, there should be a vertical wall connecting
    // them. A first approach is to raw this wall as a single rectangle, ignoring the surrounding cells. This is visually
    // ok and all walls are quads. However this forms a bad mesh because the walls aren't connected along their edges.
    // Creating a correct mesh is more tedious and takes a lot of sketching. It looks like long code but that's because
    // it has to take into account the ordering of the 4 cells sharing a vertical edge. 


    // getValue(column, row, valueIfMissing) is used to get around checking if a cell has all neighbors. This is important
    // for corner cells and edge cells. If getValue is called for a cell that doesn't exist it returns the valueIfMissing.
    // This is also used to create the bottom and left walls along the edges.


    // Column Walls: create the wall between a cell and its neighbor on column+1. Column index starts at -1 to ensure
    // that the left edge walls are also created.
    float valueOfCell, valueOfNeighbor, v1, v2;
    for (int column =-1; column <columns; column++) {
      for (int row = 0; row < rows; row++) {
        ArrayList<GridPoint> points = new ArrayList<GridPoint>();
        valueOfCell = getValue(column, row, baseValue);
        valueOfNeighbor = getValue(column + 1, row, baseValue);
        //If neighbor has same value, there is no wall
        if (valueOfCell != valueOfNeighbor) {
          //Horizontal edge
          points.add(new GridPoint(column + 1, row + 1, valueOfCell));
          points.add(new GridPoint(column + 1, row, valueOfCell));
          //Vertical edge, shared by up to two other cells
          v1 =getValue(column, row-1, baseValue);
          v2 =getValue(column+1, row-1, baseValue);
          if (valueOfCell < valueOfNeighbor) {
            if (valueOfCell < v1 && v1 < valueOfNeighbor && valueOfCell < v2 && v2 < valueOfNeighbor) {
              if (v1 == v2) {
                points.add(new GridPoint(column + 1, row, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row, v1));
                points.add(new GridPoint(column+1, row, v2));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row, v2));
                points.add(new GridPoint(column+1, row, v1));
              }
            } else if (valueOfCell < v1 && v1 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row, v1));
            } else if (valueOfCell < v2 && v2 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row, v2));
            }
          } else {
            if (valueOfNeighbor < v1 && v1 < valueOfCell && valueOfNeighbor < v2 && v2 < valueOfCell) {
              if (v1 == v2) {
                points.add(new GridPoint(column+1, row, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row, v1));
                points.add(new GridPoint(column+1, row, v2));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row, v2));
                points.add(new GridPoint(column+1, row, v1));
              }
            } else if (valueOfNeighbor < v1 && v1 < valueOfCell) {
              points.add(new GridPoint(column+1, row, v1));
            } else if (valueOfNeighbor < v2 && v2 < valueOfCell) {
              points.add(new GridPoint(column+1, row, v2));
            }
          }
          int numOfPointsInVerticalEdge1=points.size()-2;
          //Horizontal edge
          points.add(new GridPoint(column+1, row, valueOfNeighbor));
          points.add(new GridPoint(column+1, row+1, valueOfNeighbor));
          //Vertical edge, shared by up to two other cells
          v1 = getValue(column, row+1, baseValue);
          v2 = getValue(column+1, row+1, baseValue);
          if (valueOfCell < valueOfNeighbor) {
            if (valueOfCell < v1 && v1 < valueOfNeighbor && valueOfCell < v2 && v2 < valueOfNeighbor) {
              if (v1 == v2) {
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row+1, v2));
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row+1, v1));
                points.add(new GridPoint(column+1, row+1, v2));
              }
            } else if (valueOfCell < v1 && v1 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row+1, v1));
            } else if (valueOfCell < v2 && v2 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row+1, v2));
            }
          } else {
            if (valueOfNeighbor < v1 && v1 < valueOfCell && valueOfNeighbor < v2 && v2 < valueOfCell) {
              if (v1 == v2) {
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row+1, v2));
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row+1, v1));
                points.add(new GridPoint(column+1, row+1, v2));
              }
            } else if (valueOfNeighbor < v1 && v1 < valueOfCell) {
              points.add(new GridPoint(column+1, row+1, v1));
            } else if (valueOfNeighbor < v2 && v2 < valueOfCell) {
              points.add(new GridPoint(column+1, row+1, v2));
            }
          }
          int numOfPointsInVerticalEdge2=points.size()-numOfPointsInVerticalEdge1-4;
          addFaces(points, numOfPointsInVerticalEdge1, numOfPointsInVerticalEdge2);
        }
      }
    }
    // Row Walls: create the wall between a cell and its neighbor on row+1.  Row index starts at -1 to ensure
    // that the bottom edge walls are also created.
    for (int column = 0; column < columns; column++) {
      for (int row = -1; row < rows; row++) {
        ArrayList<GridPoint> points = new ArrayList<GridPoint>();
        valueOfCell = getValue(column, row, baseValue);
        valueOfNeighbor = getValue(column, row + 1, baseValue);
        //If neighbor has same value, there is no wall
        if (valueOfCell != valueOfNeighbor) {
          //Horizontal edge
          points.add(new GridPoint(column, row+1, valueOfCell));
          points.add(new GridPoint(column+1, row+1, valueOfCell));
          //Vertical edge, shared by up to two other cells
          v1 = getValue(column + 1, row, baseValue);
          v2 = getValue(column + 1, row + 1, baseValue);
          if (valueOfCell < valueOfNeighbor) {
            if (valueOfCell < v1 && v1 < valueOfNeighbor && valueOfCell < v2 && v2 < valueOfNeighbor) {
              if (v1 == v2) {
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row+1, v1));
                points.add(new GridPoint(column+1, row+1, v2));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row+1, v2));
                points.add(new GridPoint(column+1, row+1, v1));
              }
            } else if (valueOfCell < v1 && v1 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row+1, v1));
            } else if (valueOfCell < v2 && v2 < valueOfNeighbor) {
              points.add(new GridPoint(column+1, row+1, v2));
            }
          } else {
            if (valueOfNeighbor < v1 && v1 < valueOfCell && valueOfNeighbor < v2 && v2 < valueOfCell) {
              if (v1 == v2) {
                points.add(new GridPoint(column+1, row+1, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column+1, row+1, v1));
                points.add(new GridPoint(column+1, row+1, v2));
              } else if (v1 < v2) {
                points.add(new GridPoint(column+1, row+1, v2));
                points.add(new GridPoint(column+1, row+1, v1));
              }
            } else if (valueOfNeighbor < v1 && v1 < valueOfCell) {
              points.add(new GridPoint(column+1, row+1, v1));
            } else if (valueOfNeighbor < v2 && v2 < valueOfCell) {
              points.add(new GridPoint(column+1, row+1, v2));
            }
          }
          int numOfPointsInVerticalEdge1=points.size()-2;
          //Horizontal edge
          points.add(new GridPoint(column+1, row+1, valueOfNeighbor));
          points.add(new GridPoint(column, row+1, valueOfNeighbor));
          //Vertical edge, shared by up to two other cells
          v1 = getValue(column - 1, row + 1, baseValue);
          v2 = getValue(column - 1, row, baseValue);
          if (valueOfCell < valueOfNeighbor) {
            if (valueOfCell < v1 && v1 < valueOfNeighbor && valueOfCell < v2 && v2 < valueOfNeighbor) {
              if (v1 == v2) {
                points.add(new GridPoint(column, row+1, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column, row+1, v2));
                points.add(new GridPoint(column, row+1, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column, row+1, v1));
                points.add(new GridPoint(column, row+1, v2));
              }
            } else if (valueOfCell < v1 && v1 < valueOfNeighbor) {
              points.add(new GridPoint(column, row+1, v1));
            } else if (valueOfCell < v2 && v2 < valueOfNeighbor) {
              points.add(new GridPoint(column, row+1, v2));
            }
          } else {
            if (valueOfNeighbor < v1 && v1 < valueOfCell && valueOfNeighbor < v2 && v2 < valueOfCell) {
              if (v1 == v2) {
                points.add(new GridPoint(column, row+1, v1));
              } else if (v2 < v1) {
                points.add(new GridPoint(column, row+1, v2));
                points.add(new GridPoint(column, row+1, v1));
              } else if (v1 < v2) {
                points.add(new GridPoint(column, row+1, v1));
                points.add(new GridPoint(column, row+1, v2));
              }
            } else if (valueOfNeighbor < v1 && v1 < valueOfCell) {
              points.add(new GridPoint(column, row+1, v1));
            } else if (valueOfNeighbor < v2 && v2 < valueOfCell) {
              points.add(new GridPoint(column, row+1, v2));
            }
          }
          int numOfPointsInVerticalEdge2=points.size()-numOfPointsInVerticalEdge1-4;

          addFaces(points, numOfPointsInVerticalEdge1, numOfPointsInVerticalEdge2);
        }
      }
    }
  }


  //Each vertical edge of a wall can have up to two additional colinear vertices.
  // Processing doesn't like colinear vertices. This splits the wall into triangles and quads case by case.
  void addFaces(ArrayList<GridPoint> points, int numOfPointsInVerticalEdge1, int numOfPointsInVerticalEdge2) {
    //all faces should be quads or triangles
    if (points.size()==4) {
      faces.add(new GridFace(points, 0, 1, 2, 3));
    } else if (numOfPointsInVerticalEdge1==0) {
      if (numOfPointsInVerticalEdge2==1) {
        faces.add(new GridFace(points, 0, 1, 4));
        faces.add(new GridFace(points, 1, 2, 3, 4));
      } else if (numOfPointsInVerticalEdge2==2) {
        faces.add(new GridFace(points, 0, 1, 5));
        faces.add(new GridFace(points, 2, 3, 4));
        faces.add(new GridFace(points, 4, 5, 1, 2));
      }
    } else if (numOfPointsInVerticalEdge1==1) {
      if (numOfPointsInVerticalEdge2==0) {
        faces.add(new GridFace(points, 0, 1, 2));
        faces.add(new GridFace(points, 2, 3, 4, 0));
      } else if (numOfPointsInVerticalEdge2==1) {
        faces.add(new GridFace(points, 0, 1, 2, 5));
        faces.add(new GridFace(points, 2, 3, 4, 5));
      } else if (numOfPointsInVerticalEdge2==2) {
        faces.add(new GridFace(points, 0, 1, 2, 6));
        faces.add(new GridFace(points, 2, 3, 5, 6));
        faces.add(new GridFace(points, 3, 4, 5));
      }
    } else if (numOfPointsInVerticalEdge1==2) {
      if (numOfPointsInVerticalEdge2==0) {
        faces.add(new GridFace(points, 0, 1, 2));
        faces.add(new GridFace(points, 2, 3, 5, 0));
        faces.add(new GridFace(points, 3, 4, 5));
      } else if (numOfPointsInVerticalEdge2==1) {
        faces.add(new GridFace(points, 0, 1, 2, 6));
        faces.add(new GridFace(points, 2, 3, 6));
        faces.add(new GridFace(points, 3, 4, 5, 6));
      } else if (numOfPointsInVerticalEdge2==2) {
        faces.add(new GridFace(points, 0, 1, 2, 7));
        faces.add(new GridFace(points, 2, 3, 6, 7));
        faces.add(new GridFace(points, 3, 4, 5, 6));
      }
    }
  }




  float getValue(int column, int row, float baseValue) {
    if (column >= 0 && column < columns && row >= 0 && row < rows ) {
      return values[column][row];
    } else {
      return baseValue;
    }
  }


  void draw(float scaleX, float scaleY, float scaleValue, float offsetX, float offsetY, float offsetValue) {
    for (GridFace f : faces) {
      f.draw(scaleX, scaleY, scaleValue, offsetX, offsetY, offsetValue);
    }
  }

  void saveAsSTL(String name, float scaleX, float scaleY, float scaleValue, float offsetX, float offsetY, float offsetValue) {
    PrintWriter output=createWriter(name+".stl");
    output.println("solid StepGrid");
    for (GridFace f : faces) {
      if (f.points.length==3) {
        output.println("facet normal 0 0 0"); 
        output.println("   outer loop");
        for (GridPoint p : f.points) {
          output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        }
        output.println("   endloop");
        output.println("endfacet");
      } else {
        output.println("facet normal 0 0 0"); 
        output.println("   outer loop");
        GridPoint p=f.points[0];
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        p=f.points[1];
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        p=f.points[2];
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        output.println("   endloop");
        output.println("endfacet");
        output.println("facet normal 0 0 0"); 
        output.println("   outer loop");
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        p=f.points[0];
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        p=f.points[3];
        output.println("   vertex "+(offsetX+scaleX*p.x)+ " "+(offsetY+scaleY*p.y)+" "+(offsetValue+scaleValue*p.value));
        output.println("   endloop");
        output.println("endfacet");
      }
    }
    output.println("endsolid StepGrid");
    output.flush(); 
    output.close(); 
  }
}

class GridPoint {
  float x, y, value;
  GridPoint(float x, float y, float value) {
    this.x=x;
    this.y=y;
    this.value=value;
  }
}

class GridFace {
  GridPoint[] points;

  GridFace(ArrayList<GridPoint> pointList, int... indices) {
    points=new GridPoint[indices.length];
    for (int i=0; i<indices.length; i++) {
      points[i]=pointList.get(indices[i]);
    }
  }

  GridFace(GridPoint... pointList) {
    points=new GridPoint[pointList.length];
    for (int i=0; i<pointList.length; i++) {
      points[i]=pointList[i];
    }
  }

  void draw(float scaleX, float scaleY, float scaleValue, float offsetX, float offsetY, float offsetValue) {
    beginShape();
    for (GridPoint p : points) {
      vertex(offsetX+scaleX*p.x, offsetY+scaleY*p.y, offsetValue+scaleValue*p.value);
    }
    endShape(CLOSE);
  }
}

void mousePressed() {
  saveFrame("screenshot####.png");
}
