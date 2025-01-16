// Solve SAT problem (a+b+c)(b+c+d)

let ITERATIONS = 3;

qc.reset(8);
let d = qint.new(1, "d"); // 0x1
let c = qint.new(1, "c"); // 0x2
let b = qint.new(1, "b"); // 0x4
let a = qint.new(1, "a"); // 0x8
let sub_clause1 = qint.new(1, "a+b"); // 0x10
let sub_clause2 = qint.new(1, "b+c"); // 0x20
let clause1 = qint.new(1, "a+b+c"); // 0x40
let clause2 = qint.new(1, "b+c+d"); // 0x80

qc.label("prep");
qc.had(0x8|0x4|0x2|0x1);
 add_space();

for (let i = 0; i < ITERATIONS; i++){
    
    // (a+b+c)
    qc.label("clause1");
    magnitude_OR(0x8, 0x4, 0x10); // (a+b)
    magnitude_OR(0x10, 0x2, 0x40);
    
    add_space();
    
    // (b+c+d)
    qc.label("clause2");
    magnitude_OR(0x4, 0x2, 0x20); // (b+c)
    magnitude_OR(0x20, 0x1, 0x80);
    
    add_space();

    qc.label("flip phase");
    qc.cz(0x40 | 0x80);
    
    add_space();

    qc.label("clause2 inv");
    magnitude_OR_inverse(0x20, 0x1, 0x80);
    magnitude_OR_inverse(0x4, 0x2, 0x20);
    
    add_space();
    
    qc.label("clause1 inv");
    magnitude_OR_inverse(0x10, 0x2, 0x40);
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
