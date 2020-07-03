//Returns a random int i where min <= i < max

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(a) {//shuffels the given array
  for (let i = a.length - 1; i >= 1; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function generateInput(n){//creates an n sized array of n sized number arrays. both arrays of size n

  let generated= [];

  for(let k=0; k<n; ++k){//creating the nested arrays
    generated.push([]);
  }

  for(let i=0; i<n; ++i){
    for(let j=0; j<n; ++j){
      
      generated[i].push(j);
    }
    generated[i]= shuffle(generated[i]);
  }

return generated; 
}

function indexOf(a, b){
  for(let i=0; i<a.length; ++i){
    if(a[i]===b){
      return i;
    }
  }
return -1;
}

////////////////////////////////////////////////////////////////////////
// @param matchmaker: a posible solution to be tested for correctness
//  will pass all tests if the given solution is correct
////////////////////////////////////////////////////////////////////////
function oracle(matchmaker) {
  let numTests = 20; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 15; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = matchmaker(companies, candidates);
    

    /////////////////////////////////////////////////////////////////////////
    // @param input: the candidate/company that the preference is desired of
    // @param compIfTrue: boolean, true if the input given is a company
    //@return the current preference level of their current match of a given company or candidate.
    //        lower the number, the higher the preference 
    /////////////////////////////////////////////////////////////////////////
    function prefCalc(input, compIfTrue){
      if(compIfTrue){
        let matchedCan=100;

        for(let i=0; i<n; ++i){
          if(hires[i].company===input){
            matchedCan=hires[i].candidate;
          }
        }
        return indexOf(companies[input], matchedCan);
      }
      else{
        let matchedComp=100;

        for(let i=0; i<n; ++i){
          if(hires[i].candidate===input){
            matchedComp=hires[i].company;
          }
        }
        return indexOf(candidates[input], matchedComp);
      }
    }

    test('Hires length is correct', function() {
    assert(companies.length === hires.length);
    });


    test ('stability', function(){
      for(let i=0; i<n; ++i){

        let compPref= prefCalc(hires[i].company, true);// current preference level of whom theyre matched 
        let canPref= prefCalc(hires[i].candidate, false);// this is a number, the preference of their current matches


        for(let j=0; j<compPref; ++j){
          let higherCan= companies[hires[i].company][j];//now have the index in the candidates array of a candidate that the company would rather have, now need to find if said candidate
                                                        //would rather have said company over their current match
          let prefHigherCan= prefCalc(higherCan, false);// current preference of better candidate for comp

          let possibleCanPref= indexOf(candidates[higherCan], hires[i].company);
          
          assert((prefHigherCan<=possibleCanPref));//assert that there is no canadate that said company would want more than their current match, that would also want said company
        }
      for(let j=0; j<canPref; ++j){
          let higherComp= candidates[hires[i].candidate][j];//now have the index in the candidates array of a candidate that the company would rather have, now need to find if said candidate
                                                        //would rather have said company over their current match
          let prefHigherComp= prefCalc(higherComp, true);// current preference of better candidate for comp

          let possibleCompPref= indexOf(companies[higherComp], hires[i].candidate);
          assert((prefHigherComp<=possibleCompPref));//assert that there is no company that would perfer said canadate more than the canadate's current match, and that said company
                                                    // is more preferable to said canadate
        }
      
      }
      
      
      });
  }
  for (let i = 0; i < numTests; ++i) {
    let n = 100; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = matchmaker(companies, candidates);
    
    test('all companies and candidates are contained', function() {
      let testcomp=[];
      let testcan=[];
      
      for(let i=0; i<n; ++i){
        testcomp.push(hires[i].company);
        testcan.push(hires[i].candidate);
      }
      
      for(let i=0; i<n; ++i){
      assert(!(indexOf(testcomp, i)===-1));
      assert(!(indexOf(testcan, i)===-1));
      }
    
    });

  }
}
//oracle(wheat1);
//oracle(chaff1);
