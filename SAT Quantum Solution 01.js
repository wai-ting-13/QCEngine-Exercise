// Solve SAT problem (a or b) and (a or c)

const ITERATIONS = Math.floor(Math.sqrt(8));

qc.reset(5);

qint.new(1, "c"); // 0x1
qint.new(1, "b"); // 0x2
qint.new(1, "a"); // 0x4
qint.new(1, "a or b"); // 0x8
qint.new(1, "a or c"); // 0x10

qc.label("prep");
qc.had(0x1|0x2|0x4);

add_space();

for (let i = 0; i < ITERATIONS; i++){
    qc.label("clause1");
    magnitude_OR(0x4, 0x2, 0x8);
    
    add_space();
    
    qc.label("clause2");
    magnitude_OR(0x4, 0x1, 0x10);
    
    add_space();
    
    qc.label("flip phase");
    qc.cz(0x8 | 0x10);
    
    add_space();
    
    qc.label("inv clause 2");
    magnitude_OR_inverse(0x4, 0x1, 0x10);
    
    add_space();
    
    qc.label("inv clause 1");
    magnitude_OR_inverse(0x4, 0x2, 0x8);
    
    add_space();
    
    qc.label("Grover Mirror");
    grover(0x1|0x2|0x4);

    add_space();
}


// Auxiliary Functions
function magnitude_OR(bit1, bit2, clause_bit) {
  qc.not(bit1 | bit2);
  qc.cnot(clause_bit, bit1 | bit2);
  qc.not(clause_bit | bit1 | bit2);
}

function magnitude_OR_inverse(bit1, bit2, clause_bit) {
  qc.not(clause_bit | bit1 | bit2);
  qc.cnot(clause_bit, bit1 | bit2);
  qc.not(bit1 | bit2);
}

function grover(in1, in2, in3){
  qc.had(in1|in2|in3);
  qc.not(in1|in2|in3);
  qc.cz(in1|in2|in3);
  qc.not(in1|in2|in3);
  qc.had(in1|in2|in3);
}

function add_space() {
  // add some space in the diagram
  qc.label("");
  qc.nop();
}
