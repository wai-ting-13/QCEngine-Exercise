// Solve SAT problem (a+b+c)(b+c-d)(-a-c+d)

let ITERATIONS = 10;

qc.reset(10);
let d = qint.new(1, "d"); // 0x1
let c = qint.new(1, "c"); // 0x2
let b = qint.new(1, "b"); // 0x4
let a = qint.new(1, "a"); // 0x8
let sub_clause1 = qint.new(1, "a+b"); // 0x10
let sub_clause2 = qint.new(1, "b+c"); // 0x20
let sub_clause3 = qint.new(1, "-a-c"); // 0x40
let clause1 = qint.new(1, "a+b+c"); // 0x80
let clause2 = qint.new(1, "b+c-d"); // 0x100
let clause3 = qint.new(1, "-a-c+d"); // 0x200

qc.label("prep");
qc.had(0x8|0x4|0x2|0x1);
 add_space();

for (let i = 0; i < ITERATIONS; i++){
    
    // (a+b+c)
    qc.label("clause1");
    magnitude_OR(0x8, 0x4, 0x10); // (a+b)
    magnitude_OR(0x10, 0x2, 0x80); // (a+b+c)
    
    add_space();
    
    // (b+c+d)
    qc.label("clause2");
    magnitude_OR(0x4, 0x2, 0x20); // (b+c)
    qc.not(0x1);
    magnitude_OR(0x20, 0x1, 0x100); // (b+c-d)
    qc.not(0x1);
    
    add_space();
    
    // (-a-c+d)
    qc.label("clause3");
    qc.not(0x8|0x2);
    magnitude_OR(0x8, 0x2, 0x40); // (-a-c)
    qc.not(0x8|0x2);
    magnitude_OR(0x40, 0x1, 0x200); // (-a-c+d)
    
    add_space();

    qc.label("flip phase");
    qc.cz(0x80 | 0x100 | 0x200);
    
    add_space();

    qc.label("clause3 inv");
    magnitude_OR_inverse(0x40, 0x1, 0x200); // (-a-c+d)
    qc.not(0x8|0x2);
    magnitude_OR_inverse(0x8, 0x2, 0x40); // (-a-c)
    qc.not(0x8|0x2);

    add_space();

    qc.label("clause2 inv");
    qc.not(0x1);
    magnitude_OR_inverse(0x20, 0x1, 0x100);
    qc.not(0x1);
    magnitude_OR_inverse(0x4, 0x2, 0x20);
    
    add_space();

    qc.label("clause1 inv");
    magnitude_OR_inverse(0x10, 0x2, 0x80);
    magnitude_OR_inverse(0x8, 0x4, 0x10);
    
    add_space();
    
    qc.label("Grover Mirror");
    grover(0x1|0x2|0x4|0x8);
}


// Auxiliary Functions
function magnitude_OR(in1, in2, out1) {
  qc.not(in1 | in2);
  qc.cnot(out1, in1 | in2);
  qc.not(out1 | in1 | in2);
}

function magnitude_OR_inverse(in1, in2, out1) {
  qc.not(out1 | in1 | in2);
  qc.cnot(out1, in1 | in2);
  qc.not(in1 | in2);
}

function grover(in1, in2, in3, in4){
  qc.had(in1|in2|in3|in4);
  qc.not(in1|in2|in3|in4);
  qc.cz(in1|in2|in3|in4);
  qc.not(in1|in2|in3|in4);
  qc.had(in1|in2|in3|in4);
}

function add_space() {
  // add some space in the diagram
  qc.label("");
  qc.nop();
}
