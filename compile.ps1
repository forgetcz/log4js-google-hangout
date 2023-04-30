"Try to delete DIR dist ..."
if (Test-Path -Path dist) {
    Remove-Item dist -Recurse -Force -Confirm:$false
    "Dir dist deleted."
}
else {
    "Dir dist doesn't exist."
}

if ($args.count -gt 0) {
    "Try to delete DIR node_modules ..."
    if (Test-Path -Path node_modules) {
        Remove-Item node_modules -Recurse -Force -Confirm:$false
        "Dir node_modules deleted."
    }
    else {
        "Dir node_modules doesn't exist."
    }
}

if ($args.count -gt 0) {
    "Run npm i..."
    npm i
}

"Run npx tsc..."
npx tsc
